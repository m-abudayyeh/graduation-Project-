const { 
    MaintenanceRequest, User, Equipment, 
    Location, WorkOrder 
  } = require('../models');
  const responseHandler = require('../utils/responseHandler');
  const { Op } = require('sequelize');
  const notificationController = require('./notification.controller');
  
  /**
   * Get all maintenance requests for a company
   * @route GET /api/requests
   */
  exports.getAllRequests = async (req, res, next) => {
    try {
      const { companyId, role, id: userId } = req.user;
      const { 
        page = 1, limit = 10, search, status, 
        priority, equipmentId, requesterId 
      } = req.query;
      
      const offset = (page - 1) * limit;
      
      // Build query conditions
      const whereConditions = { companyId };
      
      // If requester, only show their own requests
      if (role === 'requester') {
        whereConditions.requesterId = userId;
      }
      
      // Add status filter if provided
      if (status) {
        whereConditions.status = status;
      }
      
      // Add priority filter if provided
      if (priority) {
        whereConditions.priority = priority;
      }
      
      // Add equipment filter if provided
      if (equipmentId) {
        whereConditions.equipmentId = equipmentId;
      }
      
      // Add requester filter if provided
      if (requesterId && role !== 'requester') {
        whereConditions.requesterId = requesterId;
      }
      
      // Add search filter if provided
      if (search) {
        whereConditions[Op.or] = [
          { title: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } }
        ];
      }
      
      // Get requests with pagination and include related entities
      const { count, rows } = await MaintenanceRequest.findAndCountAll({
        where: whereConditions,
        include: [
          { model: User, as: 'requester', attributes: ['id', 'firstName', 'lastName', 'email'] },
          { model: User, as: 'approver', attributes: ['id', 'firstName', 'lastName', 'email'] },
          { model: Equipment, as: 'equipment', include: [{ model: Location, as: 'location' }] },
          { model: WorkOrder, as: 'workOrder' }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });
      
      return responseHandler.paginate(
        res, 
        200, 
        'Maintenance requests retrieved successfully', 
        { count, rows, limit, page }
      );
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Get maintenance request by ID
   * @route GET /api/requests/:id
   */
  exports.getRequestById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { companyId, role, id: userId } = req.user;
      
      // Build query conditions
      const whereConditions = { id, companyId };
      
      // If requester, only allow access to their own requests
      if (role === 'requester') {
        whereConditions.requesterId = userId;
      }
      
      // Find request
      const request = await MaintenanceRequest.findOne({
        where: whereConditions,
        include: [
          { model: User, as: 'requester', attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber'] },
          { model: User, as: 'approver', attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber'] },
          { model: Equipment, as: 'equipment', include: [{ model: Location, as: 'location' }] },
          { model: WorkOrder, as: 'workOrder' }
        ]
      });
      
      if (!request) {
        return responseHandler.error(res, 404, 'Maintenance request not found');
      }
      
      return responseHandler.success(res, 200, 'Maintenance request retrieved successfully', request);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Create new maintenance request
   * @route POST /api/requests
   */
  exports.createRequest = async (req, res, next) => {
    try {
      const { companyId, id: userId } = req.user;
      const { title, description, priority, equipmentId } = req.body;
      
      // Validate equipment belongs to company if provided
      if (equipmentId) {
        const equipment = await Equipment.findOne({
          where: { id: equipmentId, companyId }
        });
        
        if (!equipment) {
          return responseHandler.error(res, 404, 'Equipment not found');
        }
      }
      
      // Create request
      const request = await MaintenanceRequest.create({
        title,
        description,
        priority,
        equipmentId,
        requesterId: userId,
        status: 'pending',
        companyId
      });
      
      // Fetch created request with related entities
      const createdRequest = await MaintenanceRequest.findByPk(request.id, {
        include: [
          { model: User, as: 'requester', attributes: ['id', 'firstName', 'lastName', 'email'] },
          { model: Equipment, as: 'equipment', include: [{ model: Location, as: 'location' }] }
        ]
      });
      
      // Send notifications to admins and supervisors about new request
      const admins = await User.findAll({
        where: { 
          companyId,
          role: { [Op.in]: ['admin', 'supervisor'] }
        },
        attributes: ['id']
      });
      
      for (const admin of admins) {
        await notificationController.createNotification({
          type: 'new_request',
          title: 'New Maintenance Request',
          message: `A new maintenance request has been submitted: ${title}`,
          userId: admin.id,
          companyId,
          relatedId: request.id,
          relatedType: 'MaintenanceRequest'
        });
      }
      
      return responseHandler.success(res, 201, 'Maintenance request created successfully', createdRequest);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Update maintenance request
   * @route PUT /api/requests/:id
   */
  exports.updateRequest = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { companyId, role, id: userId } = req.user;
      const updates = req.body;
      
      // Build query conditions
      const whereConditions = { id, companyId };
      
      // If requester, only allow updating their own requests and only if pending
      if (role === 'requester') {
        whereConditions.requesterId = userId;
        whereConditions.status = 'pending';
        
        // Requesters can only update certain fields
        const allowedUpdates = ['title', 'description', 'priority'];
        Object.keys(updates).forEach(key => {
          if (!allowedUpdates.includes(key)) {
            delete updates[key];
          }
        });
      }
      
      // Find request
      const request = await MaintenanceRequest.findOne({
        where: whereConditions
      });
      
      if (!request) {
        return responseHandler.error(res, 404, 'Maintenance request not found or cannot be updated');
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
      
      // Remove fields that shouldn't be updated
      delete updates.companyId;
      delete updates.requesterId;
      delete updates.workOrderId;
      
      // Special handling for approving/rejecting requests
      if (role !== 'requester' && updates.status) {
        if (updates.status === 'approved' || updates.status === 'rejected') {
          updates.approverId = userId;
          updates.approvalDate = new Date();
          
          // Send notification to requester
          await notificationController.createNotification({
            type: updates.status === 'approved' ? 'request_approved' : 'request_rejected',
            title: `Maintenance Request ${updates.status === 'approved' ? 'Approved' : 'Rejected'}`,
            message: `Your maintenance request "${request.title}" has been ${updates.status}`,
            userId: request.requesterId,
            companyId,
            relatedId: request.id,
            relatedType: 'MaintenanceRequest'
          });
        }
      }
      
      // Update request
      await request.update(updates);
      
      // Fetch updated request with related entities
      const updatedRequest = await MaintenanceRequest.findByPk(request.id, {
        include: [
          { model: User, as: 'requester', attributes: ['id', 'firstName', 'lastName', 'email'] },
          { model: User, as: 'approver', attributes: ['id', 'firstName', 'lastName', 'email'] },
          { model: Equipment, as: 'equipment', include: [{ model: Location, as: 'location' }] },
          { model: WorkOrder, as: 'workOrder' }
        ]
      });
      
      return responseHandler.success(res, 200, 'Maintenance request updated successfully', updatedRequest);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Delete maintenance request
   * @route DELETE /api/requests/:id
   */
  exports.deleteRequest = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { companyId, role, id: userId } = req.user;
      
      // Build query conditions
      const whereConditions = { id, companyId };
      
      // If requester, only allow deleting their own pending requests
      if (role === 'requester') {
        whereConditions.requesterId = userId;
        whereConditions.status = 'pending';
      } else if (role !== 'admin' && role !== 'supervisor') {
        return responseHandler.error(res, 403, 'You do not have permission to delete maintenance requests');
      }
      
      // Find request
      const request = await MaintenanceRequest.findOne({
        where: whereConditions
      });
      
      if (!request) {
        return responseHandler.error(res, 404, 'Maintenance request not found or cannot be deleted');
      }
      
      // Check if request has a work order
      if (request.status === 'converted_to_work_order') {
        return responseHandler.error(
          res, 
          400, 
          'Cannot delete request because it has been converted to a work order'
        );
      }
      
      // Delete request
      await request.destroy();
      
      return responseHandler.success(res, 200, 'Maintenance request deleted successfully');
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Upload images to maintenance request
   * @route POST /api/requests/:id/images
   */
  exports.uploadImages = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { companyId, role, id: userId } = req.user;
      
      // Build query conditions
      const whereConditions = { id, companyId };
      
      // If requester, only allow uploading to their own pending requests
      if (role === 'requester') {
        whereConditions.requesterId = userId;
        whereConditions.status = 'pending';
      }
      
      // Find request
      const request = await MaintenanceRequest.findOne({
        where: whereConditions
      });
      
      if (!request) {
        return responseHandler.error(res, 404, 'Maintenance request not found or cannot be updated');
      }
      
      // Check if files were uploaded
      if (!req.files || req.files.length === 0) {
        return responseHandler.error(res, 400, 'No files uploaded');
      }
      
      // Get existing images
      const existingImages = request.images || [];
      
      // Add new image paths
      const newImages = req.files.map(file => file.path.replace(/\\/g, '/'));
      
      // Update request with combined images
      request.images = [...existingImages, ...newImages];
      await request.save();
      
      return responseHandler.success(res, 200, 'Images uploaded successfully', request);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Upload files to maintenance request
   * @route POST /api/requests/:id/files
   */
  exports.uploadFiles = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { companyId, role, id: userId } = req.user;
      
      // Build query conditions
      const whereConditions = { id, companyId };
      
      // If requester, only allow uploading to their own pending requests
      if (role === 'requester') {
        whereConditions.requesterId = userId;
        whereConditions.status = 'pending';
      }
      
      // Find request
      const request = await MaintenanceRequest.findOne({
        where: whereConditions
      });
      
      if (!request) {
        return responseHandler.error(res, 404, 'Maintenance request not found or cannot be updated');
      }
      
      // Check if files were uploaded
      if (!req.files || req.files.length === 0) {
        return responseHandler.error(res, 400, 'No files uploaded');
      }
      
      // Get existing files
      const existingFiles = request.files || [];
      
      // Add new file paths
      const newFiles = req.files.map(file => file.path.replace(/\\/g, '/'));
      
      // Update request with combined files
      request.files = [...existingFiles, ...newFiles];
      await request.save();
      
      return responseHandler.success(res, 200, 'Files uploaded successfully', request);
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Convert maintenance request to work order
   * @route POST /api/requests/:id/convert
   */
  exports.convertToWorkOrder = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { companyId, role } = req.user;
      const { primaryAssigneeId, secondaryAssigneeId, dueDate } = req.body;
      
      // Only admin or supervisor can convert requests
      if (role !== 'admin' && role !== 'supervisor') {
        return responseHandler.error(res, 403, 'You do not have permission to convert maintenance requests');
      }
      
      // Find request
      const request = await MaintenanceRequest.findOne({
        where: { id, companyId },
        include: [{ model: Equipment, as: 'equipment' }]
      });
      
      if (!request) {
        return responseHandler.error(res, 404, 'Maintenance request not found');
      }
      
      // Check if request is approved
      if (request.status !== 'approved') {
        return responseHandler.error(res, 400, 'Only approved requests can be converted to work orders');
      }
      
      // Check if already converted
      if (request.status === 'converted_to_work_order') {
        return responseHandler.error(res, 400, 'Request has already been converted to a work order');
      }
      
      // Validate assignees
      if (primaryAssigneeId) {
        const primaryAssignee = await User.findOne({
          where: { id: primaryAssigneeId, companyId }
        });
        
        if (!primaryAssignee) {
          return responseHandler.error(res, 404, 'Primary assignee not found');
        }
      }
      
      if (secondaryAssigneeId) {
        const secondaryAssignee = await User.findOne({
          where: { id: secondaryAssigneeId, companyId }
        });
        
        if (!secondaryAssignee) {
          return responseHandler.error(res, 404, 'Secondary assignee not found');
        }
      }
      
      // Create work order from request
      const workOrder = await WorkOrder.create({
        title: request.title,
        description: request.description,
        priority: request.priority,
        equipmentId: request.equipmentId,
        locationId: request.equipment ? request.equipment.locationId : null,
        primaryAssigneeId,
        secondaryAssigneeId,
        dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 1 week if not specified
        startDate: new Date(),
        status: 'open',
        isPreventive: false,
        maintenanceRequestId: request.id,
        companyId
      });
      
      // Update request status
      await request.update({
        status: 'converted_to_work_order'
      });
      
      // Send notifications to assignees
      if (primaryAssigneeId) {
        // Create in-app notification
        await notificationController.createNotification({
          type: 'new_task',
          title: 'New Work Order Assigned',
          message: `You have been assigned as primary on work order: ${workOrder.title}`,
          userId: primaryAssigneeId,
          companyId,
          relatedId: workOrder.id,
          relatedType: 'WorkOrder'
        });
      }
      
      if (secondaryAssigneeId) {
        // Create in-app notification
        await notificationController.createNotification({
          type: 'new_task',
          title: 'New Work Order Assigned',
          message: `You have been assigned as secondary on work order: ${workOrder.title}`,
          userId: secondaryAssigneeId,
          companyId,
          relatedId: workOrder.id,
          relatedType: 'WorkOrder'
        });
      }
      
      // Fetch the created work order with related entities
      const createdWorkOrder = await WorkOrder.findByPk(workOrder.id, {
        include: [
          { model: Equipment, as: 'equipment' },
          { model: Location, as: 'location' },
          { model: User, as: 'primaryAssignee', attributes: ['id', 'firstName', 'lastName', 'email'] },
          { model: User, as: 'secondaryAssignee', attributes: ['id', 'firstName', 'lastName', 'email'] },
          { model: MaintenanceRequest, as: 'maintenanceRequest' }
        ]
      });
      
      return responseHandler.success(
        res, 
        201, 
        'Maintenance request converted to work order successfully', 
        createdWorkOrder
      );
    } catch (error) {
      next(error);
    }
  };