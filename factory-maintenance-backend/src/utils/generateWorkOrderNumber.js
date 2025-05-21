const { WorkOrder } = require('../models');

const generateWorkOrderNumber = async (companyId) => {
  // إحضار أحدث أمر عمل لنفس الشركة (بما في ذلك المحذوفين)
  const latestWorkOrder = await WorkOrder.findOne({
    where: { companyId },
    attributes: ['workOrderNumber'],
    order: [['createdAt', 'DESC']],
    paranoid: false
  });

  let nextNumber = 1;

  if (latestWorkOrder && latestWorkOrder.workOrderNumber) {
    const match = latestWorkOrder.workOrderNumber.match(/WO-(\d+)/);
    if (match) {
      const lastNum = parseInt(match[1], 10);
      nextNumber = lastNum + 1;
    }
  }

  const formattedNumber = `WO-${nextNumber.toString().padStart(4, '0')}`;
  return formattedNumber;
};

module.exports = generateWorkOrderNumber;
