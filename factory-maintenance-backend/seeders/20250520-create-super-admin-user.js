'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('Super@123', 10);

    await queryInterface.bulkInsert('Users', [{
      firstName: 'mohammed',
      lastName: 'abidayyeh',
      email: 'optiplant.mailer@gmail.com',
      phoneNumber: '0785078600',
      password: hashedPassword,
      role: 'super_admin',
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', { email: 'optiplant.mailer@gmail.com' }, {});
  }
};
