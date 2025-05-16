'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // أولاً: إنشاء أنواع ENUM (استخدام أحرف صغيرة للاتساق)
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_subscriptions_plantype" AS ENUM ('monthly', 'annual');
      CREATE TYPE "enum_subscriptions_status" AS ENUM ('active', 'expired', 'cancelled', 'trial');
      CREATE TYPE "enum_subscriptions_notificationpreference" AS ENUM ('email', 'in-app', 'both', 'none');
    `);

    // ثانياً: إنشاء الجدول
    await queryInterface.createTable('Subscriptions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      planType: {
        type: "enum_subscriptions_plantype",  // استخدام نفس اسم النوع بالضبط
        allowNull: false
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      currency: {
        type: Sequelize.STRING,
        defaultValue: 'USD'
      },
      status: {
        type: "enum_subscriptions_status",  // استخدام نفس اسم النوع بالضبط
        defaultValue: 'trial'
      },
      isTrial: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      trialEndDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      stripeSubscriptionId: {
        type: Sequelize.STRING,
        allowNull: true
      },
      stripePaymentIntentId: {
        type: Sequelize.STRING,
        allowNull: true
      },
      autoRenew: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      invoiceUrl: {
        type: Sequelize.STRING,
        allowNull: true
      },
      notificationPreference: {
        type: "enum_subscriptions_notificationpreference",  // استخدام نفس اسم النوع بالضبط
        defaultValue: 'both'
      },
      maxUsers: {
        type: Sequelize.INTEGER,
        defaultValue: 10
      },
      lastNotificationSent: {
        type: Sequelize.DATE,
        allowNull: true
      },
      companyId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Companies',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      lastModifiedBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    // أولاً: حذف الجدول
    await queryInterface.dropTable('Subscriptions');
    
    // ثانياً: حذف أنواع ENUM
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "enum_subscriptions_plantype";
      DROP TYPE IF EXISTS "enum_subscriptions_status";
      DROP TYPE IF EXISTS "enum_subscriptions_notificationpreference";
    `);
  }
};