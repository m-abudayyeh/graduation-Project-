const { 
    WorkOrder, MaintenanceRequest, Equipment, 
    StorePart, User, Company, Location,
    PreventiveMaintenance, Sequelize 
  } = require('../models');
  const responseHandler = require('../utils/responseHandler');
  const { Op } = require('sequelize');
  
  /**
   * Get dashboard statistics
   * @route GET /api/statistics/dashboard
   */
  exports.getDashboardStats = async (req, res, next) => {
    try {
      const { companyId } = req.user;
      
      // Get current date for calculations
      const today = new Date();
      const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      // Calculate work order statistics
      const workOrderStats = await WorkOrder.findAll({
        attributes: [
          'status',
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
        ],
        where: { companyId },
        group: ['status']
      });
      
      const workOrderStatusCounts = workOrderStats.reduce((acc, item) => {
        acc[item.status] = parseInt(item.count);
        return acc;
      }, {});
      
      // Get count of due work orders (due today or overdue)
      const dueWorkOrders = await WorkOrder.count({
        where: {
          companyId,
          status: { [Op.ne]: 'completed' },
          dueDate: { [Op.lte]: today }
        }
      });
      
      // Get count of work orders due this month
      const monthlyWorkOrders = await WorkOrder.count({
        where: {
          companyId,
          status: { [Op.ne]: 'completed' },
          dueDate: {
            [Op.between]: [thisMonth, nextMonth]
          }
        }
      });
      
      // Get count of pending maintenance requests
      const pendingRequests = await MaintenanceRequest.count({
        where: {
          companyId,
          status: 'pending'
        }
      });
      
      // Get count of equipment
      const equipmentCount = await Equipment.count({
        where: { companyId }
      });
      
      // Get count of low stock parts
      const lowStockParts = await StorePart.count({
        where: {
          companyId,
          quantity: { [Op.lt]: 5 }
        }
      });
      
      // Get preventive maintenance due soon
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      
      const pmDueSoon = await PreventiveMaintenance.count({
        where: {
          companyId,
          status: 'active',
          nextDueDate: {
            [Op.lte]: nextWeek,
            [Op.gte]: today
          }
        }
      });
      
      // Bundle all statistics
      const statistics = {
        workOrderStats: {
          ...workOrderStatusCounts,
          dueToday: dueWorkOrders,
          thisMonth: monthlyWorkOrders,
          total: Object.values(workOrderStatusCounts).reduce((sum, count) => sum + count, 0)
        },
        maintenanceRequests: {
          pending: pendingRequests
        },
        inventory: {
          lowStock: lowStockParts,
          totalEquipment: equipmentCount
        },
        preventiveMaintenance: {
          dueSoon: pmDueSoon
        }
      };
      
      return responseHandler.success(res, 200, 'Dashboard statistics retrieved successfully', statistics);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Get detailed work order statistics
   * @route GET /api/statistics/work-orders
   */
  exports.getWorkOrderStats = async (req, res, next) => {
    try {
      const { companyId } = req.user;
      const { startDate, endDate } = req.query;
      
      // Set date range
      let dateCondition = {};
      if (startDate && endDate) {
        dateCondition = {
          createdAt: {
            [Op.between]: [new Date(startDate), new Date(endDate)]
          }
        };
      }
      
      // Get work orders by status
      const statusStats = await WorkOrder.findAll({
        attributes: [
          'status',
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
        ],
        where: {
          companyId,
          ...dateCondition
        },
        group: ['status']
      });
      
      // Get work orders by priority
      const priorityStats = await WorkOrder.findAll({
        attributes: [
          'priority',
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
        ],
        where: {
          companyId,
          ...dateCondition
        },
        group: ['priority']
      });
      
      // Get work orders by type (preventive vs. corrective)
      const typeStats = await WorkOrder.findAll({
        attributes: [
          'isPreventive',
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
        ],
        where: {
          companyId,
          ...dateCondition
        },
        group: ['isPreventive']
      });
      
      // Get work orders by location
      const locationStats = await WorkOrder.findAll({
        attributes: [
          'locationId',
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
        ],
        where: {
          companyId,
          locationId: { [Op.ne]: null },
          ...dateCondition
        },
        include: [{ model: Location, as: 'location', attributes: ['name'] }],
        group: ['locationId', 'location.id', 'location.name']
      });
      
      // Get work orders by month
      const monthlyStats = await WorkOrder.findAll({
        attributes: [
          [Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('createdAt')), 'month'],
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
        ],
        where: {
          companyId,
          ...dateCondition
        },
        group: [Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('createdAt'))],
        order: [Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('createdAt'))]
      });
      
      // Get average completion time
      const { QueryTypes } = require('sequelize');
      const avgCompletionTime = await db.sequelize.query(`
        SELECT AVG(EXTRACT(EPOCH FROM ("completionDate" - "createdAt"))/3600)::float as avg_hours
        FROM "WorkOrders"
        WHERE "companyId" = :companyId
        AND "status" = 'completed'
        AND "completionDate" IS NOT NULL
        ${startDate && endDate ? 'AND "createdAt" BETWEEN :startDate AND :endDate' : ''}
      `, {
        replacements: { 
          companyId,
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null
        },
        type: QueryTypes.SELECT
      });
      
      // Format the statistics
      const statistics = {
        byStatus: statusStats.reduce((acc, item) => {
          acc[item.status] = parseInt(item.count);
          return acc;
        }, {}),
        byPriority: priorityStats.reduce((acc, item) => {
          acc[item.priority] = parseInt(item.count);
          return acc;
        }, {}),
        byType: {
          preventive: typeStats.find(item => item.isPreventive)?.count || 0,
          corrective: typeStats.find(item => !item.isPreventive)?.count || 0
        },
        byLocation: locationStats.map(item => ({
          locationId: item.locationId,
          locationName: item.location.name,
          count: parseInt(item.count)
        })),
        byMonth: monthlyStats.map(item => ({
          month: item.month,
          count: parseInt(item.count)
        })),
        averageCompletionHours: avgCompletionTime[0]?.avg_hours || 0,
        total: await WorkOrder.count({
          where: {
            companyId,
            ...dateCondition
          }
        })
      };
      
      return responseHandler.success(res, 200, 'Work order statistics retrieved successfully', statistics);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Get inventory statistics
   * @route GET /api/statistics/inventory
   */
  exports.getInventoryStats = async (req, res, next) => {
    try {
      const { companyId } = req.user;
      
      // Get equipment count by category
      const equipmentByCategory = await Equipment.findAll({
        attributes: [
          'category',
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
        ],
        where: {
          companyId,
          category: { [Op.ne]: null }
        },
        group: ['category'],
        order: [[Sequelize.literal('count'), 'DESC']]
      });
      
      // Get equipment count by location
      const equipmentByLocation = await Equipment.findAll({
        attributes: [
          'locationId',
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
        ],
        where: {
          companyId,
          locationId: { [Op.ne]: null }
        },
        include: [{ model: Location, as: 'location', attributes: ['name'] }],
        group: ['locationId', 'location.id', 'location.name']
      });
      
      // Get store parts count by category
      const partsByCategory = await StorePart.findAll({
        attributes: [
          'category',
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
          [Sequelize.fn('SUM', Sequelize.col('quantity')), 'totalQuantity']
        ],
        where: {
          companyId,
          category: { [Op.ne]: null }
        },
        group: ['category'],
        order: [[Sequelize.literal('count'), 'DESC']]
      });
      
      // Get low stock parts
      const lowStockParts = await StorePart.findAll({
        where: {
          companyId,
          quantity: { [Op.lt]: 5 }
        },
        include: [{ model: Location, as: 'location' }],
        order: [['quantity', 'ASC']]
      });
      
      // Format the statistics
      const statistics = {
        equipment: {
          total: await Equipment.count({ where: { companyId } }),
          byCategory: equipmentByCategory.map(item => ({
            category: item.category,
            count: parseInt(item.count)
          })),
          byLocation: equipmentByLocation.map(item => ({
            locationId: item.locationId,
            locationName: item.location.name,
            count: parseInt(item.count)
          }))
        },
        parts: {
          total: await StorePart.count({ where: { companyId } }),
          totalQuantity: await StorePart.sum('quantity', { where: { companyId } }) || 0,
          byCategory: partsByCategory.map(item => ({
            category: item.category,
            count: parseInt(item.count),
            totalQuantity: parseInt(item.totalQuantity)
          })),
          lowStock: {
            count: lowStockParts.length,
            items: lowStockParts.map(part => ({
              id: part.id,
              name: part.name,
              partNumber: part.partNumber,
              category: part.category,
              quantity: part.quantity,
              location: part.location ? part.location.name : null
            }))
          }
        }
      };
      
      return responseHandler.success(res, 200, 'Inventory statistics retrieved successfully', statistics);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Get super admin statistics
   * @route GET /api/statistics/admin
   */
  exports.getSuperAdminStats = async (req, res, next) => {
    try {
      const { role } = req.user;
      
      // Only super_admin can access these statistics
      if (role !== 'super_admin') {
        return responseHandler.error(res, 403, 'Access denied');
      }
      
      // Get companies by subscription status
      const companiesBySubscription = await Company.findAll({
        attributes: [
          'subscriptionStatus',
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
        ],
        group: ['subscriptionStatus']
      });
      
      // Get companies by subscription type
      const companiesByType = await Company.findAll({
        attributes: [
          'subscriptionType',
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
        ],
        group: ['subscriptionType']
      });
      
      // Get total users count
      const totalUsers = await User.count();
      
      // Get users by role
      const usersByRole = await User.findAll({
        attributes: [
          'role',
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
        ],
        group: ['role']
      });
      
      // Get recently registered companies
      const recentCompanies = await Company.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']]
      });
      
      // Get expiring subscriptions
      const oneWeekLater = new Date();
      oneWeekLater.setDate(oneWeekLater.getDate() + 7);
      
      const expiringSubscriptions = await Company.findAll({
        where: {
          subscriptionStatus: 'active',
          subscriptionEndDate: {
            [Op.lt]: oneWeekLater
          }
        },
        order: [['subscriptionEndDate', 'ASC']]
      });
      
      // Format the statistics
      const statistics = {
        companies: {
          total: await Company.count(),
          bySubscriptionStatus: companiesBySubscription.reduce((acc, item) => {
            acc[item.subscriptionStatus] = parseInt(item.count);
            return acc;
          }, {}),
          bySubscriptionType: companiesByType.reduce((acc, item) => {
            acc[item.subscriptionType] = parseInt(item.count);
            return acc;
          }, {}),
          recentRegistrations: recentCompanies.map(company => ({
            id: company.id,
            name: company.name,
            createdAt: company.createdAt,
            subscriptionStatus: company.subscriptionStatus
          })),
          expiringSubscriptions: expiringSubscriptions.map(company => ({
            id: company.id,
            name: company.name,
            subscriptionEndDate: company.subscriptionEndDate,
            subscriptionType: company.subscriptionType
          }))
        },
        users: {
          total: totalUsers,
          byRole: usersByRole.reduce((acc, item) => {
            acc[item.role] = parseInt(item.count);
            return acc;
          }, {})
        },
        workOrders: {
          total: await WorkOrder.count()
        },
        requests: {
          total: await MaintenanceRequest.count()
        }
      };
      
      return responseHandler.success(res, 200, 'Super admin statistics retrieved successfully', statistics);
    } catch (error) {
      next(error);
    }
  };