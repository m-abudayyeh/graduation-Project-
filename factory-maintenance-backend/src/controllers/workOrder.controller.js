const { 
  WorkOrder, User, Equipment, Location, StorePart, 
  WorkOrderParts, PreventiveMaintenance, MaintenanceRequest
} = require('../models');
const responseHandler = require('../utils/responseHandler');
const { Op, Sequelize } = require('sequelize');
const emailService = require('../utils/emailService');
const notificationController = require('./notification.controller');
/**
 * Get all work orders for a company
 * @route GET /api/work-orders
 */
exports.getAllWorkOrders = async (req, res, next) => {
  try {
    const { companyId } = req.user;
    const { 
      page = 1, limit = 10, search, status, 
      priority, locationId, equipmentId, assigneeId,
      startDate, endDate, isPreventive, tags,
      includeDeleted = false // إضافة خيار لعرض العناصر المحذوفة
    } = req.query;
    
    const offset = (page - 1) * limit;
    
    // Build query conditions
    const whereConditions = { companyId };
    
    // Add status filter if provided
    if (status) {
      whereConditions.status = status;
    }
    
    // Add priority filter if provided
    if (priority) {
      whereConditions.priority = priority;
    }
    
    // Add location filter if provided
    if (locationId) {
      whereConditions.locationId = locationId;
    }
    
    // Add equipment filter if provided
    if (equipmentId) {
      whereConditions.equipmentId = equipmentId;
    }
    
    // Add date range filter if provided
    if (startDate && endDate) {
      whereConditions.dueDate = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    } else if (startDate) {
      whereConditions.dueDate = {
        [Op.gte]: new Date(startDate)
      };
    } else if (endDate) {
      whereConditions.dueDate = {
        [Op.lte]: new Date(endDate)
      };
    }
    
    // Add preventive maintenance filter if provided
    if (isPreventive !== undefined) {
      whereConditions.isPreventive = isPreventive === 'true';
    }
    
    // Add tags filter if provided
    if (tags) {
      const tagArray = tags.split(',');
      whereConditions.tags = {
        [Op.overlap]: tagArray
      };
    }
    
    // Add assignee filter if provided
    if (assigneeId) {
      whereConditions[Op.or] = [
        { primaryAssigneeId: assigneeId },
        { secondaryAssigneeId: assigneeId }
      ];
    }
    
    // Add search filter if provided
    if (search) {
      whereConditions[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { workOrderNumber: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    // Get work orders with pagination and include related entities
    const { count, rows } = await WorkOrder.findAndCountAll({
      where: whereConditions,
      include: [
        { model: Equipment, as: 'equipment' },
        { model: Location, as: 'location' },
        { model: User, as: 'primaryAssignee', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: User, as: 'secondaryAssignee', attributes: ['id', 'firstName', 'lastName', 'email'] }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [
        ['dueDate', 'ASC'],
        ['createdAt', 'DESC']
      ],
      paranoid: !includeDeleted // السماح بعرض العناصر المحذوفة عند الطلب
    });
    
    return responseHandler.paginate(
      res, 
      200, 
      'Work orders retrieved successfully', 
      { count, rows, limit, page }
    );
  } catch (error) {
    next(error);
  }
};


/**
 * Get work order by ID
 * @route GET /api/work-orders/:id
 */
exports.getWorkOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { companyId } = req.user;
    
    // Find work order
    const workOrder = await WorkOrder.findOne({
      where: { id, companyId },
      include: [
        { model: Equipment, as: 'equipment' },
        { model: Location, as: 'location' },
        { model: User, as: 'primaryAssignee', attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber'] },
        { model: User, as: 'secondaryAssignee', attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber'] },
        { 
          model: StorePart, 
          as: 'parts',
          through: { attributes: ['quantity'] }
        },
        { model: PreventiveMaintenance, as: 'preventiveMaintenance' },
        { model: MaintenanceRequest, as: 'maintenanceRequest' }
      ]
    });
    
    if (!workOrder) {
      return responseHandler.error(res, 404, 'Work order not found');
    }
    
    return responseHandler.success(res, 200, 'Work order retrieved successfully', workOrder);
  } catch (error) {
    next(error);
  }
};

/**
 * توليد رقم تسلسلي للأمر
 * @param {*} companyId 
 */
const generateWorkOrderNumber = async (companyId) => {
  // الحصول على آخر رقم للأمر لهذه الشركة
  const latestWorkOrder = await WorkOrder.findOne({
    where: { companyId },
    order: [['createdAt', 'DESC']]
  });

  const currentYear = new Date().getFullYear();
  let sequentialNumber = 1;

  if (latestWorkOrder && latestWorkOrder.workOrderNumber) {
    // استخراج الرقم التسلسلي من آخر أمر
    const match = latestWorkOrder.workOrderNumber.match(/WO-\d{4}-(\d+)/);
    if (match && match[1]) {
      sequentialNumber = parseInt(match[1]) + 1;
    }
  }

  // تنسيق الرقم التسلسلي بأربعة أرقام على الأقل
  return `WO-${currentYear}-${sequentialNumber.toString().padStart(4, '0')}`;
};

/**
 * Create new work order
 * @route POST /api/work-orders
 */
exports.createWorkOrder = async (req, res, next) => {
  try {
    const { companyId, role } = req.user;
    
    // Only admin or supervisor can create work orders
    if (role !== 'admin' && role !== 'supervisor') {
      return responseHandler.error(res, 403, 'You do not have permission to create work orders');
    }
    
    const { 
      title, description, category, priority,
      dueDate, startDate, equipmentId, locationId,
      primaryAssigneeId, secondaryAssigneeId,
      isPreventive, preventiveMaintenanceId, maintenanceRequestId,
      notes, externalParts, externalLocations, tags,
      estimatedCost, estimatedHours, solution
    } = req.body;
    
    // Validate equipment belongs to company
    if (equipmentId) {
      const equipment = await Equipment.findOne({
        where: { id: equipmentId, companyId }
      });
      
      if (!equipment) {
        return responseHandler.error(res, 404, 'Equipment not found');
      }
    }
    
    // Validate location belongs to company
    if (locationId) {
      const location = await Location.findOne({
        where: { id: locationId, companyId }
      });
      
      if (!location) {
        return responseHandler.error(res, 404, 'Location not found');
      }
    }
    
    // Validate primary assignee belongs to company
    if (primaryAssigneeId) {
      const primaryAssignee = await User.findOne({
        where: { id: primaryAssigneeId, companyId }
      });
      
      if (!primaryAssignee) {
        return responseHandler.error(res, 404, 'Primary assignee not found');
      }
    }
    
    // Validate secondary assignee belongs to company
    if (secondaryAssigneeId) {
      const secondaryAssignee = await User.findOne({
        where: { id: secondaryAssigneeId, companyId }
      });
      
      if (!secondaryAssignee) {
        return responseHandler.error(res, 404, 'Secondary assignee not found');
      }
    }
    
    // توليد رقم تسلسلي للأمر
    const workOrderNumber = await generateWorkOrderNumber(companyId);
    
    // Create work order
    const workOrder = await WorkOrder.create({
      workOrderNumber,
      title,
      description,
      category,
      priority,
      dueDate,
      startDate,
      equipmentId,
      locationId,
      primaryAssigneeId,
      secondaryAssigneeId,
      isPreventive: !!isPreventive,
      preventiveMaintenanceId,
      maintenanceRequestId,
      notes,
      estimatedCost,
      estimatedHours,
      solution,
      externalParts: externalParts || [],
      externalLocations: externalLocations || [],
      tags: tags || [],
      status: 'open',
      companyId
    });
    
    // Update maintenance request status if provided
    if (maintenanceRequestId) {
      await MaintenanceRequest.update(
        { status: 'converted_to_work_order' },
        { where: { id: maintenanceRequestId, companyId } }
      );
    }
    
    // Fetch created work order with related entities
    const createdWorkOrder = await WorkOrder.findByPk(workOrder.id, {
      include: [
        { model: Equipment, as: 'equipment' },
        { model: Location, as: 'location' },
        { model: User, as: 'primaryAssignee', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: User, as: 'secondaryAssignee', attributes: ['id', 'firstName', 'lastName', 'email'] }
      ]
    });
    
    // Send notification to assignees
    if (primaryAssigneeId) {
      // Send email notification
      const primaryAssignee = await User.findByPk(primaryAssigneeId);
      if (primaryAssignee) {
        emailService.sendWorkOrderNotification(primaryAssignee, createdWorkOrder);
        
        // Create in-app notification
        await notificationController.createNotification({
          type: 'new_task',
          title: 'New Work Order Assigned',
          message: `You have been assigned as primary on work order: ${title}`,
          userId: primaryAssigneeId,
          companyId,
          relatedId: workOrder.id,
          relatedType: 'WorkOrder'
        });
      }
    }
    
    if (secondaryAssigneeId) {
      // Send email notification
      const secondaryAssignee = await User.findByPk(secondaryAssigneeId);
      if (secondaryAssignee) {
        emailService.sendWorkOrderNotification(secondaryAssignee, createdWorkOrder);
        
        // Create in-app notification
        await notificationController.createNotification({
          type: 'new_task',
          title: 'New Work Order Assigned',
          message: `You have been assigned as secondary on work order: ${title}`,
          userId: secondaryAssigneeId,
          companyId,
          relatedId: workOrder.id,
          relatedType: 'WorkOrder'
        });
      }
    }
    
    return responseHandler.success(res, 201, 'Work order created successfully', createdWorkOrder);
  } catch (error) {
    next(error);
  }
};

/**
 * Update work order
 * @route PUT /api/work-orders/:id
 */
exports.updateWorkOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { companyId, role, id: userId } = req.user;
    const updates = req.body;
    
    // Find work order
    const workOrder = await WorkOrder.findOne({
      where: { id, companyId },
      include: [
        { model: User, as: 'primaryAssignee', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: User, as: 'secondaryAssignee', attributes: ['id', 'firstName', 'lastName', 'email'] }
      ]
    });
    
    if (!workOrder) {
      return responseHandler.error(res, 404, 'Work order not found');
    }
    
    // Check permissions
    const isAssignee = workOrder.primaryAssigneeId === userId || workOrder.secondaryAssigneeId === userId;
    
    if (role !== 'admin' && role !== 'supervisor' && !isAssignee) {
      return responseHandler.error(res, 403, 'You do not have permission to update this work order');
    }
    
    // Technicians can only update status, notes, actualHours, solution, and completionDate
    if (role === 'technician' && isAssignee) {
      const allowedUpdates = ['status', 'notes', 'actualHours', 'actualCost', 'solution'];
      Object.keys(updates).forEach(key => {
        if (!allowedUpdates.includes(key)) {
          delete updates[key];
        }
      });
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
    
    // Validate location belongs to company if provided
    if (updates.locationId) {
      const location = await Location.findOne({
        where: { id: updates.locationId, companyId }
      });
      
      if (!location) {
        return responseHandler.error(res, 404, 'Location not found');
      }
    }
    
    // Validate primary assignee belongs to company if provided
    if (updates.primaryAssigneeId) {
      const primaryAssignee = await User.findOne({
        where: { id: updates.primaryAssigneeId, companyId }
      });
      
      if (!primaryAssignee) {
        return responseHandler.error(res, 404, 'Primary assignee not found');
      }
    }
    
    // Validate secondary assignee belongs to company if provided
    if (updates.secondaryAssigneeId) {
      const secondaryAssignee = await User.findOne({
        where: { id: updates.secondaryAssigneeId, companyId }
      });
      
      if (!secondaryAssignee) {
        return responseHandler.error(res, 404, 'Secondary assignee not found');
      }
    }
    
    // Check if status is being updated to completed
    const completionDate = updates.status === 'completed' ? new Date() : null;
    if (completionDate) {
      updates.completionDate = completionDate;
    }
    
    // Remove fields that shouldn't be updated
    delete updates.companyId;
    delete updates.preventiveMaintenanceId;
    delete updates.maintenanceRequestId;
    delete updates.workOrderNumber;
    
    // Store original assignees for notification purposes
    const originalPrimaryAssigneeId = workOrder.primaryAssigneeId;
    const originalSecondaryAssigneeId = workOrder.secondaryAssigneeId;
    
    // Update work order
    await workOrder.update(updates);
    
    // Send notifications if assignees changed
    if (updates.primaryAssigneeId && updates.primaryAssigneeId !== originalPrimaryAssigneeId) {
      // Send email notification to new primary assignee
      const primaryAssignee = await User.findByPk(updates.primaryAssigneeId);
      if (primaryAssignee) {
        emailService.sendWorkOrderNotification(primaryAssignee, workOrder);
        
        // Create in-app notification
        await notificationController.createNotification({
          type: 'task_update',
          title: 'Work Order Assignment',
          message: `You have been assigned as primary on work order: ${workOrder.title}`,
          userId: updates.primaryAssigneeId,
          companyId,
          relatedId: workOrder.id,
          relatedType: 'WorkOrder'
        });
      }
    }
    
    if (updates.secondaryAssigneeId && updates.secondaryAssigneeId !== originalSecondaryAssigneeId) {
      // Send email notification to new secondary assignee
      const secondaryAssignee = await User.findByPk(updates.secondaryAssigneeId);
      if (secondaryAssignee) {
        emailService.sendWorkOrderNotification(secondaryAssignee, workOrder);
        
        // Create in-app notification
        await notificationController.createNotification({
          type: 'task_update',
          title: 'Work Order Assignment',
          message: `You have been assigned as secondary on work order: ${workOrder.title}`,
          userId: updates.secondaryAssigneeId,
          companyId,
          relatedId: workOrder.id,
          relatedType: 'WorkOrder'
        });
      }
    }
    
    // Fetch updated work order with related entities
    const updatedWorkOrder = await WorkOrder.findByPk(workOrder.id, {
      include: [
        { model: Equipment, as: 'equipment' },
        { model: Location, as: 'location' },
        { model: User, as: 'primaryAssignee', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: User, as: 'secondaryAssignee', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { 
          model: StorePart, 
          as: 'parts',
          through: { attributes: ['quantity'] }
        }
      ]
    });
    
    return responseHandler.success(res, 200, 'Work order updated successfully', updatedWorkOrder);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete work order
 * @route DELETE /api/work-orders/:id
 */
exports.deleteWorkOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { companyId, role } = req.user;
    
    // Only admin can delete work orders
    if (role !== 'admin') {
      return responseHandler.error(res, 403, 'Only admin can delete work orders');
    }
    
    // Find work order
    const workOrder = await WorkOrder.findOne({
      where: { id, companyId }
    });
    
    if (!workOrder) {
      return responseHandler.error(res, 404, 'Work order not found');
    }
    
    // Delete work order parts associations first
    await WorkOrderParts.destroy({
      where: { workOrderId: id }
    });
    
    // Delete work order (soft delete)
    await workOrder.update({ isDeleted: true });
    await workOrder.destroy(); // هذا سيقوم بالحذف الناعم (soft delete) بفضل إعدادات paranoid
    
    return responseHandler.success(res, 200, 'Work order deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Upload work order images
 * @route POST /api/work-orders/:id/images
 */
exports.uploadImages = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { companyId, role, id: userId } = req.user;
    
    // Find work order
    const workOrder = await WorkOrder.findOne({
      where: { id, companyId }
    });
    
    if (!workOrder) {
      return responseHandler.error(res, 404, 'Work order not found');
    }
    
    // Check permissions
    const isAssignee = workOrder.primaryAssigneeId === userId || workOrder.secondaryAssigneeId === userId;
    
    if (role !== 'admin' && role !== 'supervisor' && !isAssignee) {
      return responseHandler.error(res, 403, 'You do not have permission to update this work order');
    }
    
    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      return responseHandler.error(res, 400, 'No files uploaded');
    }
    
    // Get existing images
    const existingImages = workOrder.images || [];
    
    // Add new image paths
    const newImages = req.files.map(file => file.path.replace(/\\/g, '/'));
    
    // Update work order with combined images
    workOrder.images = [...existingImages, ...newImages];
    await workOrder.save();
    
    return responseHandler.success(res, 200, 'Work order images uploaded successfully', workOrder);
  } catch (error) {
    next(error);
  }
};

/**
 * Add parts to work order
 * @route POST /api/work-orders/:id/parts
 */
exports.addParts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { companyId, role, id: userId } = req.user;
    const { parts } = req.body;
    
    // Validate parts array
    if (!parts || !Array.isArray(parts) || parts.length === 0) {
      return responseHandler.error(res, 400, 'Invalid parts data');
    }
    
    // Find work order
    const workOrder = await WorkOrder.findOne({
      where: { id, companyId }
    });
    
    if (!workOrder) {
      return responseHandler.error(res, 404, 'Work order not found');
    }
    
    // Check permissions
    const isAssignee = workOrder.primaryAssigneeId === userId || workOrder.secondaryAssigneeId === userId;
    
    if (role !== 'admin' && role !== 'supervisor' && !isAssignee) {
      return responseHandler.error(res, 403, 'You do not have permission to update this work order');
    }
    
    // Process each part
    for (const part of parts) {
      const { storePartId, quantity } = part;
      
      // Validate quantity
      const partQuantity = parseInt(quantity) || 1;
      if (partQuantity <= 0) {
        continue;
      }
      
      // Find store part
      const storePart = await StorePart.findOne({
        where: { id: storePartId, companyId }
      });
      
      if (!storePart) {
        continue;
      }
      
      // Check if part already exists in work order
      const existingPart = await WorkOrderParts.findOne({
        where: { workOrderId: id, storePartId }
      });
      
      if (existingPart) {
        // Update quantity
        await existingPart.update({
          quantity: existingPart.quantity + partQuantity
        });
      } else {
        // Add new association
        await WorkOrderParts.create({
          workOrderId: id,
          storePartId,
          quantity: partQuantity
        });
      }
      
      // Update store part quantity (subtract used parts)
      if (role !== 'viewer') {
        const newStoreQuantity = Math.max(0, storePart.quantity - partQuantity);
        await storePart.update({ quantity: newStoreQuantity });
        
        // Check if stock is low and create notification if needed
        if (newStoreQuantity < 5) {
          await notificationController.createNotification({
            type: 'part_low_stock',
            title: 'Low Stock Alert',
            message: `Part ${storePart.name} is running low (${newStoreQuantity} remaining)`,
            userId: null, // Will be sent to all admins and supervisors
            companyId,
            relatedId: storePart.id,
            relatedType: 'StorePart'
          });
        }
      }
    }
    
    // Fetch updated work order with parts
    const updatedWorkOrder = await WorkOrder.findByPk(id, {
      include: [
        { model: StorePart, as: 'parts', through: { attributes: ['quantity'] } }
      ]
    });
    
    return responseHandler.success(res, 200, 'Parts added to work order successfully', updatedWorkOrder.parts);
  } catch (error) {
    next(error);
  }
};

/**
 * Remove part from work order
 * @route DELETE /api/work-orders/:id/parts/:partId
 */
exports.removePart = async (req, res, next) => {
  try {
    const { id, partId } = req.params;
    const { companyId, role, id: userId } = req.user;
    
    // Find work order
    const workOrder = await WorkOrder.findOne({
      where: { id, companyId }
    });
    
    if (!workOrder) {
      return responseHandler.error(res, 404, 'Work order not found');
    }
    
    // Check permissions
    const isAssignee = workOrder.primaryAssigneeId === userId || workOrder.secondaryAssigneeId === userId;
    
    if (role !== 'admin' && role !== 'supervisor' && !isAssignee) {
      return responseHandler.error(res, 403, 'You do not have permission to update this work order');
    }
    
    // Find the association
    const workOrderPart = await WorkOrderParts.findOne({
      where: { workOrderId: id, storePartId: partId }
    });
    
    if (!workOrderPart) {
      return responseHandler.error(res, 404, 'Part not found in work order');
    }
    
    // Option to return parts to inventory
    const { returnToInventory } = req.query;
    
    if (returnToInventory === 'true' && role !== 'viewer') {
      // Find store part
      const storePart = await StorePart.findOne({
        where: { id: partId, companyId }
      });
      
      if (storePart) {
        // Update store part quantity (add returned parts)
        await storePart.update({
          quantity: storePart.quantity + workOrderPart.quantity
        });
      }
    }
    
    // Remove association
    await workOrderPart.destroy();
    
    return responseHandler.success(res, 200, 'Part removed from work order successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * إضافة قطع غيار خارجية
 * @route POST /api/work-orders/:id/external-parts
 */
exports.addExternalParts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { companyId, role, id: userId } = req.user;
    const { externalParts } = req.body;
    
    // Validate external parts array
    if (!externalParts || !Array.isArray(externalParts) || externalParts.length === 0) {
      return responseHandler.error(res, 400, 'Invalid external parts data');
    }
    
    // Find work order
    const workOrder = await WorkOrder.findOne({
      where: { id, companyId }
    });
    
    if (!workOrder) {
      return responseHandler.error(res, 404, 'Work order not found');
    }
    
    // Check permissions
    const isAssignee = workOrder.primaryAssigneeId === userId || workOrder.secondaryAssigneeId === userId;
    
    if (role !== 'admin' && role !== 'supervisor' && !isAssignee) {
      return responseHandler.error(res, 403, 'You do not have permission to update this work order');
    }
    
    // Get existing external parts
    const existingExternalParts = workOrder.externalParts || [];
    
    // Update work order with combined external parts
    await workOrder.update({
      externalParts: [...existingExternalParts, ...externalParts]
    });
    
    return responseHandler.success(res, 200, 'External parts added to work order successfully', workOrder.externalParts);
  } catch (error) {
    next(error);
  }
};

/**
 * إضافة مواقع خارجية
 * @route POST /api/work-orders/:id/external-locations
 */
exports.addExternalLocations = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { companyId, role, id: userId } = req.user;
    const { externalLocations } = req.body;
    
    // Validate external locations array
    if (!externalLocations || !Array.isArray(externalLocations) || externalLocations.length === 0) {
      return responseHandler.error(res, 400, 'Invalid external locations data');
    }
    
    // Find work order
    const workOrder = await WorkOrder.findOne({
      where: { id, companyId }
    });
    
    if (!workOrder) {
      return responseHandler.error(res, 404, 'Work order not found');
    }
    
    // Check permissions
    const isAssignee = workOrder.primaryAssigneeId === userId || workOrder.secondaryAssigneeId === userId;
    
    if (role !== 'admin' && role !== 'supervisor' && !isAssignee) {
      return responseHandler.error(res, 403, 'You do not have permission to update this work order');
    }
    
    // Get existing external locations
    const existingExternalLocations = workOrder.externalLocations || [];
    
    // Update work order with combined external locations
    await workOrder.update({
      externalLocations: [...existingExternalLocations, ...externalLocations]
    });
    
    return responseHandler.success(res, 200, 'External locations added to work order successfully', workOrder.externalLocations);
  } catch (error) {
    next(error);
  }
};

/**
 * Get work order statistics
 * @route GET /api/work-orders/statistics
 */
exports.getStatistics = async (req, res, next) => {
  try {
    const { companyId } = req.user;
    const { startDate, endDate } = req.query;
    
    // Build date range condition
    const dateCondition = {};
    if (startDate && endDate) {
      dateCondition.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    } else if (startDate) {
      dateCondition.createdAt = {
        [Op.gte]: new Date(startDate)
      };
    } else if (endDate) {
      dateCondition.createdAt = {
        [Op.lte]: new Date(endDate)
      };
    }
    
    // Get counts by status
    const statusCounts = await WorkOrder.findAll({
      attributes: [
        'status',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      where: {
        companyId,
        ...dateCondition
      },
      group: ['status'],
      raw: true
    });
    
    // Get counts by priority
    const priorityCounts = await WorkOrder.findAll({
      attributes: [
        'priority',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      where: {
        companyId,
        ...dateCondition
      },
      group: ['priority'],
      raw: true
    });
    
    // Get counts by preventive vs corrective
    const typeCounts = await WorkOrder.findAll({
      attributes: [
        'isPreventive',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      where: {
        companyId,
        ...dateCondition
      },
      group: ['isPreventive'],
      raw: true
    });
    
    // Get average completion time in days
    const completedWorkOrders = await WorkOrder.findAll({
      attributes: [
        [Sequelize.fn('AVG', 
          Sequelize.fn('EXTRACT', Sequelize.literal('EPOCH FROM ("completionDate" - "createdAt")') / 86400)
        ), 'avgCompletionDays']
      ],
      where: {
        companyId,
        status: 'completed',
        completionDate: { [Op.ne]: null },
        ...dateCondition
      },
      raw: true
    });
    
    // Get cost statistics
    const costStats = await WorkOrder.findAll({
      attributes: [
        [Sequelize.fn('SUM', Sequelize.col('actualCost')), 'totalCost'],
        [Sequelize.fn('AVG', Sequelize.col('actualCost')), 'avgCost'],
        [Sequelize.fn('MAX', Sequelize.col('actualCost')), 'maxCost']
      ],
      where: {
        companyId,
        actualCost: { [Op.ne]: null },
        ...dateCondition
      },
      raw: true
    });
    
    // Format the statistics
    const statistics = {
      byStatus: statusCounts.reduce((acc, item) => {
        acc[item.status] = parseInt(item.count);
        return acc;
      }, {}),
      byPriority: priorityCounts.reduce((acc, item) => {
        acc[item.priority] = parseInt(item.count);
        return acc;
      }, {}),
      byType: {
        preventive: parseInt(typeCounts.find(item => item.isPreventive)?.count || 0),
        corrective: parseInt(typeCounts.find(item => !item.isPreventive)?.count || 0)
      },
      time: {
        avgCompletionDays: parseFloat(completedWorkOrders[0]?.avgCompletionDays || 0).toFixed(2)
      },
      cost: {
        total: parseFloat(costStats[0]?.totalCost || 0).toFixed(2),
        average: parseFloat(costStats[0]?.avgCost || 0).toFixed(2),
        max: parseFloat(costStats[0]?.maxCost || 0).toFixed(2)
      },
      total: await WorkOrder.count({ where: { companyId, ...dateCondition } })
    };
    
    return responseHandler.success(res, 200, 'Work order statistics retrieved successfully', statistics);
  } catch (error) {
    next(error);
  }
};
/*
 * Get all deleted work orders
 * @route GET /api/work-orders/deleted
 */
exports.getDeletedWorkOrders = async (req, res, next) => {
  try {
    const { companyId } = req.user;
    const { page = 1, limit = 10 } = req.query;
    
    const offset = (page - 1) * limit;
    
    // Get deleted work orders with pagination
    const { count, rows } = await WorkOrder.findAndCountAll({
      where: { companyId },
      include: [
        { model: Equipment, as: 'equipment' },
        { model: Location, as: 'location' },
        { model: User, as: 'primaryAssignee', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: User, as: 'secondaryAssignee', attributes: ['id', 'firstName', 'lastName', 'email'] }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['deletedAt', 'DESC']],
      paranoid: false, // استرجاع العناصر المحذوفة
      where: {
        deletedAt: { [Op.ne]: null } // فقط العناصر المحذوفة
      }
    });
    
    return responseHandler.paginate(
      res, 
      200, 
      'Deleted work orders retrieved successfully', 
      { count, rows, limit, page }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Restore deleted work order
 * @route PUT /api/work-orders/:id/restore
 */
exports.restoreWorkOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { companyId } = req.user;
    
    // Find the deleted work order
    const workOrder = await WorkOrder.findOne({
      where: { id, companyId },
      paranoid: false // البحث في العناصر المحذوفة
    });
    
    if (!workOrder) {
      return responseHandler.error(res, 404, 'Work order not found');
    }
    
    if (!workOrder.deletedAt) {
      return responseHandler.error(res, 400, 'Work order is not deleted');
    }
    
    // استعادة أمر العمل المحذوف
    await workOrder.restore();
    
    return responseHandler.success(res, 200, 'Work order restored successfully', workOrder);
  } catch (error) {
    next(error);
  }
};
/**
 * Delete work order
 * @route DELETE /api/work-orders/:id
 */
exports.deleteWorkOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { companyId, role } = req.user;
    
    // Only admin can delete work orders
    if (role !== 'admin') {
      return responseHandler.error(res, 403, 'Only admin can delete work orders');
    }
    
    // Find work order
    const workOrder = await WorkOrder.findOne({
      where: { id, companyId }
    });
    
    if (!workOrder) {
      return responseHandler.error(res, 404, 'Work order not found');
    }
    
    // Delete work order parts associations first
    await WorkOrderParts.destroy({
      where: { workOrderId: id }
    });
    
    // تطبيق الحذف الناعم
    // بما أننا قمنا بإعداد الموديل مع paranoid: true
    // فإن دالة destroy() ستقوم تلقائياً بعملية الحذف الناعم
    // عن طريق تعيين قيمة في حقل deletedAt
    await workOrder.destroy(); 
    
    return responseHandler.success(res, 200, 'Work order deleted successfully');
  } catch (error) {
    next(error);
  }
};

