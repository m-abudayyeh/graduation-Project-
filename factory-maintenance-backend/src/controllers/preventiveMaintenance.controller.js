const { 
    PreventiveMaintenance, Equipment, WorkOrder,
    User, Location
  } = require('../models');
  const responseHandler = require('../utils/responseHandler');
  const { Op, Sequelize } = require('sequelize');
  const notificationController = require('./notification.controller');
  
  /**
   * Get all preventive maintenance schedules for a company
   * @route GET /api/preventive-maintenance
   */
  exports.getAllSchedules = async (req, res, next) => {
    try {
      const { companyId } = req.user;
      const { page = 1, limit = 10, search, status, equipmentId } = req.query;
      
      const offset = (page - 1) * limit;
      
      // Build query conditions
      const whereConditions = { companyId };
      
      // Add status filter if provided
      if (status) {
        whereConditions.status = status;
      }
      
      // Add equipment filter if provided
      if (equipmentId) {
        whereConditions.equipmentId = equipmentId;
      }
      
      // Add search filter if provided
      if (search) {
        whereConditions[Op.or] = [
          { title: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } }
        ];
      }
      
      // Get PM schedules with pagination and include related entities
      const { count, rows } = await PreventiveMaintenance.findAndCountAll({
        where: whereConditions,
        include: [
          { model: Equipment, as: 'equipment', include: [{ model: Location, as: 'location' }] }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [
          ['nextDueDate', 'ASC'],
          ['createdAt', 'DESC']
        ]
      });
      
      return responseHandler.paginate(
        res, 
        200, 
        'Preventive maintenance schedules retrieved successfully', 
        { count, rows, limit, page }
      );
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Get preventive maintenance schedule by ID
   * @route GET /api/preventive-maintenance/:id
   */
  exports.getScheduleById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { companyId } = req.user;
      
      // Find PM schedule
      const schedule = await PreventiveMaintenance.findOne({
        where: { id, companyId },
        include: [
          { model: Equipment, as: 'equipment', include: [{ model: Location, as: 'location' }] },
          { model: WorkOrder, as: 'workOrders', limit: 5, order: [['createdAt', 'DESC']] }
        ]
      });
      
      if (!schedule) {
        return responseHandler.error(res, 404, 'Preventive maintenance schedule not found');
      }
      
      return responseHandler.success(res, 200, 'Preventive maintenance schedule retrieved successfully', schedule);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Create new preventive maintenance schedule
   * @route POST /api/preventive-maintenance
   */
  exports.createSchedule = async (req, res, next) => {
    try {
      const { companyId, role } = req.user;
      
      // Only admin or supervisor can create PM schedules
      if (role !== 'admin' && role !== 'supervisor') {
        return responseHandler.error(res, 403, 'You do not have permission to create preventive maintenance schedules');
      }
      
      const { 
        title, description, equipmentId, frequency,
        customFrequencyDays, nextDueDate, priority,
        instructions
      } = req.body;
      
      // Validate equipment belongs to company
      if (!equipmentId) {
        return responseHandler.error(res, 400, 'Equipment is required');
      }
      
      const equipment = await Equipment.findOne({
        where: { id: equipmentId, companyId }
      });
      
      if (!equipment) {
        return responseHandler.error(res, 404, 'Equipment not found');
      }
      
      // Create PM schedule
      const schedule = await PreventiveMaintenance.create({
        title,
        description,
        equipmentId,
        frequency,
        customFrequencyDays: frequency === 'custom' ? customFrequencyDays : null,
        nextDueDate: new Date(nextDueDate),
        priority,
        instructions,
        status: 'active',
        companyId
      });
      
      // Fetch created schedule with related entities
      const createdSchedule = await PreventiveMaintenance.findByPk(schedule.id, {
        include: [
          { model: Equipment, as: 'equipment', include: [{ model: Location, as: 'location' }] }
        ]
      });
      
      return responseHandler.success(res, 201, 'Preventive maintenance schedule created successfully', createdSchedule);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Update preventive maintenance schedule
   * @route PUT /api/preventive-maintenance/:id
   */
  exports.updateSchedule = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { companyId, role } = req.user;
      const updates = req.body;
      
      // Only admin or supervisor can update PM schedules
      if (role !== 'admin' && role !== 'supervisor') {
        return responseHandler.error(res, 403, 'You do not have permission to update preventive maintenance schedules');
      }
      
      // Find PM schedule
      const schedule = await PreventiveMaintenance.findOne({
        where: { id, companyId }
      });
      
      if (!schedule) {
        return responseHandler.error(res, 404, 'Preventive maintenance schedule not found');
      }
      
      // Validate equipment belongs to company if provided
      if (updates.equipmentId) {
        const equipment = await Equipment.findOne({
          where: { id: updates.equipmentId, companyId }
        });
        
        if (!equipment) {
          return responseHandler.error(res, 404, 'Equipment not found');
        }
      }
      
      // Check frequency and custom days
      if (updates.frequency === 'custom' && !updates.customFrequencyDays) {
        return responseHandler.error(res, 400, 'Custom frequency requires days value');
      }
      
      if (updates.frequency !== 'custom') {
        updates.customFrequencyDays = null;
      }
      
      // Remove fields that shouldn't be updated
      delete updates.companyId;
      delete updates.lastCompletedDate;
      
      // Format nextDueDate if provided
      if (updates.nextDueDate) {
        updates.nextDueDate = new Date(updates.nextDueDate);
      }
      
      // Update PM schedule
      await schedule.update(updates);
      
      // Fetch updated schedule with related entities
      const updatedSchedule = await PreventiveMaintenance.findByPk(schedule.id, {
        include: [
          { model: Equipment, as: 'equipment', include: [{ model: Location, as: 'location' }] }
        ]
      });
      
      return responseHandler.success(res, 200, 'Preventive maintenance schedule updated successfully', updatedSchedule);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Delete preventive maintenance schedule
   * @route DELETE /api/preventive-maintenance/:id
   */
  exports.deleteSchedule = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { companyId, role } = req.user;
      
      // Only admin can delete PM schedules
      if (role !== 'admin') {
        return responseHandler.error(res, 403, 'Only admin can delete preventive maintenance schedules');
      }
      
      // Find PM schedule
      const schedule = await PreventiveMaintenance.findOne({
        where: { id, companyId }
      });
      
      if (!schedule) {
        return responseHandler.error(res, 404, 'Preventive maintenance schedule not found');
      }
      
      // Check if schedule has any associated work orders
      const workOrderCount = await WorkOrder.count({
        where: { preventiveMaintenanceId: id }
      });
      
      if (workOrderCount > 0) {
        return responseHandler.error(
          res, 
          400, 
          'Cannot delete schedule because it has work orders associated with it'
        );
      }
      
      // Delete schedule
      await schedule.destroy();
      
      return responseHandler.success(res, 200, 'Preventive maintenance schedule deleted successfully');
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Generate work order from preventive maintenance schedule
   * @route POST /api/preventive-maintenance/:id/generate-work-order
   */
  exports.generateWorkOrder = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { companyId, role } = req.user;
      const { assignToId } = req.body;
      
      // Only admin or supervisor can generate work orders
      if (role !== 'admin' && role !== 'supervisor') {
        return responseHandler.error(res, 403, 'You do not have permission to generate work orders');
      }
      
      // Find PM schedule
      const schedule = await PreventiveMaintenance.findOne({
        where: { id, companyId },
        include: [{ model: Equipment, as: 'equipment' }]
      });
      
      if (!schedule) {
        return responseHandler.error(res, 404, 'Preventive maintenance schedule not found');
      }
      
      // Validate assignee if provided
      let assigneeId = null;
      if (assignToId) {
        const assignee = await User.findOne({
          where: { id: assignToId, companyId }
        });
        
        if (!assignee) {
          return responseHandler.error(res, 404, 'Assignee not found');
        }
        
        assigneeId = assignee.id;
      }
      
      // Create work order from PM schedule
      const workOrder = await WorkOrder.create({
        title: `PM: ${schedule.title}`,
        description: schedule.description,
        category: 'Preventive Maintenance',
        priority: schedule.priority,
        dueDate: schedule.nextDueDate,
        startDate: new Date(),
        equipmentId: schedule.equipmentId,
        locationId: schedule.equipment.locationId,
        primaryAssigneeId: assigneeId,
        notes: schedule.instructions,
        status: 'open',
        isPreventive: true,
        preventiveMaintenanceId: schedule.id,
        companyId
      });
      
      // If work order created successfully, update the PM schedule
      
      // Calculate next due date based on frequency
      let nextDueDate = new Date(schedule.nextDueDate);
      
      switch (schedule.frequency) {
        case 'daily':
          nextDueDate.setDate(nextDueDate.getDate() + 1);
          break;
        case 'weekly':
          nextDueDate.setDate(nextDueDate.getDate() + 7);
          break;
        case 'monthly':
          nextDueDate.setMonth(nextDueDate.getMonth() + 1);
          break;
        case 'quarterly':
          nextDueDate.setMonth(nextDueDate.getMonth() + 3);
          break;
        case 'semi_annually':
          nextDueDate.setMonth(nextDueDate.getMonth() + 6);
          break;
        case 'annually':
          nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);
          break;
        case 'custom':
          if (schedule.customFrequencyDays) {
            nextDueDate.setDate(nextDueDate.getDate() + schedule.customFrequencyDays);
          }
          break;
      }
      
      // Update schedule with new due date
      await schedule.update({
        lastCompletedDate: new Date(),
        nextDueDate
      });
      
      // Send notification to assignee if assigned
      if (assigneeId) {
        const assignee = await User.findByPk(assigneeId);
        
        // Create in-app notification
        await notificationController.createNotification({
          type: 'new_task',
          title: 'New PM Work Order',
          message: `You have been assigned to preventive maintenance work order: ${workOrder.title}`,
          userId: assigneeId,
          companyId,
          relatedId: workOrder.id,
          relatedType: 'WorkOrder'
        });
      }
      
      // Fetch created work order with related entities
      const createdWorkOrder = await WorkOrder.findByPk(workOrder.id, {
        include: [
          { model: Equipment, as: 'equipment' },
          { model: User, as: 'primaryAssignee', attributes: ['id', 'firstName', 'lastName', 'email'] },
          { model: PreventiveMaintenance, as: 'preventiveMaintenance' }
        ]
      });
      
      return responseHandler.success(res, 201, 'Work order generated successfully', createdWorkOrder);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Get due preventive maintenance schedules
   * @route GET /api/preventive-maintenance/due
   */
  exports.getDueSchedules = async (req, res, next) => {
    try {
      const { companyId } = req.user;
      const { days = 7 } = req.query;
      
      // Calculate cutoff date
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() + parseInt(days));
      
      // Find due PM schedules
      const dueSchedules = await PreventiveMaintenance.findAll({
        where: {
          companyId,
          status: 'active',
          nextDueDate: {
            [Op.lte]: cutoffDate
          }
        },
        include: [
          { model: Equipment, as: 'equipment', include: [{ model: Location, as: 'location' }] }
        ],
        order: [['nextDueDate', 'ASC']]
      });
      
      return responseHandler.success(
        res, 
        200, 
        'Due preventive maintenance schedules retrieved successfully', 
        dueSchedules
      );
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Get preventive maintenance statistics
   * @route GET /api/preventive-maintenance/statistics
   */
  exports.getStatistics = async (req, res, next) => {
    try {
      const { companyId } = req.user;
      
      // Get counts by frequency
      const frequencyCounts = await PreventiveMaintenance.findAll({
        attributes: [
          'frequency',
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
        ],
        where: { companyId },
        group: ['frequency'],
        raw: true
      });
      
      // Get counts by status
      const statusCounts = await PreventiveMaintenance.findAll({
        attributes: [
          'status',
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
        ],
        where: { companyId },
        group: ['status'],
        raw: true
      });
      
      // Get due in next week
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      
      const dueNextWeek = await PreventiveMaintenance.count({
        where: {
          companyId,
          status: 'active',
          nextDueDate: {
            [Op.lte]: nextWeek
          }
        }
      });
      
      // Get due now (overdue)
      const now = new Date();
      
      const overdue = await PreventiveMaintenance.count({
        where: {
          companyId,
          status: 'active',
          nextDueDate: {
            [Op.lt]: now
          }
        }
      });
      
      // Format the statistics
      const statistics = {
        byFrequency: frequencyCounts.reduce((acc, item) => {
          acc[item.frequency] = parseInt(item.count);
          return acc;
        }, {}),
        byStatus: statusCounts.reduce((acc, item) => {
          acc[item.status] = parseInt(item.count);
          return acc;
        }, {}),
        dueNextWeek,
        overdue,
        total: await PreventiveMaintenance.count({ where: { companyId } })
      };
      
      return responseHandler.success(res, 200, 'Preventive maintenance statistics retrieved successfully', statistics);
    } catch (error) {
      next(error);
    }
  };