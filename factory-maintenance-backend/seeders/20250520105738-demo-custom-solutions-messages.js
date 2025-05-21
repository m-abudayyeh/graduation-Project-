'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const currentDate = new Date();
    // Create an array of 5 sample messages with different data
    const customSolutionsMessages = [
      {
        name: 'محمد أحمد',
        email: 'mohammed.ahmed@example.com',
        companyName: 'المصنع الوطني للمعادن',
        industry: 'manufacturing',
        message: 'نحن مصنع متخصص في صناعة المعادن ونبحث عن حل لتحسين عمليات الصيانة لدينا. لدينا حوالي 50 آلة تحتاج إلى صيانة دورية، ونواجه مشكلة في جدولة الصيانة وتتبع قطع الغيار. نرغب في الحصول على نظام مخصص يساعدنا على تنظيم هذه العمليات بشكل أفضل ويقلل من وقت توقف الآلات.',
        isRead: true,
        createdAt: new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        updatedAt: new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000)
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@foodprocessors.com',
        companyName: 'Premium Food Processors',
        industry: 'food',
        message: 'We are a medium-sized food processing company looking for a maintenance management solution that complies with food safety regulations (HACCP, ISO 22000). We need to track cleaning schedules, maintenance tasks, and equipment inspections. Our facility has around 25 processing machines and 10 packaging lines. Can your system be customized to include food safety compliance checks and documentation?',
        isRead: true,
        createdAt: new Date(currentDate.getTime() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
        updatedAt: new Date(currentDate.getTime() - 14 * 24 * 60 * 60 * 1000)
      },
      {
        name: 'Ali Hassan',
        email: 'ali.hassan@petrochemical.org',
        companyName: 'الخليج للبتروكيماويات',
        industry: 'oil',
        message: 'شركتنا تعمل في مجال البتروكيماويات ولدينا مصانع في عدة مواقع. نحتاج إلى نظام موحد لإدارة الصيانة يمكنه التعامل مع مواقع متعددة ويدعم متطلبات السلامة والجودة الخاصة بصناعتنا. هل يمكن لنظامكم أن يوفر تقارير شاملة عن أداء الصيانة عبر جميع المواقع؟ ونحتاج أيضاً إلى تكامل مع نظام ERP الحالي لدينا.',
        isRead: false,
        createdAt: new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        updatedAt: new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        name: 'Maria Rodriguez',
        email: 'maria@citygeneral.med',
        companyName: 'City General Hospital',
        industry: 'healthcare',
        message: 'I am the facility manager at City General Hospital. We are interested in implementing a maintenance management system for our medical equipment and facilities. We have strict regulatory requirements and need to ensure all maintenance is properly documented. We have approximately 500+ medical devices that require regular maintenance and calibration. Can your system handle healthcare-specific requirements and integrate with our existing hospital management system?',
        isRead: false,
        createdAt: new Date(currentDate.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        updatedAt: new Date(currentDate.getTime() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        name: 'Ahmed Khalid',
        email: 'ahmed.khalid@smarttech.ae',
        companyName: 'Smart Technology Solutions',
        industry: 'electronics',
        message: 'نحن شركة تصنيع إلكترونيات متوسطة الحجم ونبحث عن حل لإدارة الصيانة يمكن تخصيصه لاحتياجاتنا. لدينا خط إنتاج متخصص يتطلب صيانة دقيقة وجدولة مفصلة. نريد نظاماً يمكنه تتبع مؤشرات أداء الصيانة (KPIs) ويساعدنا في تحليل البيانات لتحسين كفاءة الإنتاج. هل بالإمكان الحصول على عرض توضيحي لنظامكم لرؤية كيف يمكن أن يلبي احتياجاتنا؟',
        isRead: false,
        createdAt: new Date(), // Today
        updatedAt: new Date()
      }
    ];

    // Insert the sample messages into the database
    return await queryInterface.bulkInsert('CustomSolutionsMessages', customSolutionsMessages, {});
  },

  down: async (queryInterface, Sequelize) => {
    // Remove all entries when reverting the seed
    return await queryInterface.bulkDelete('CustomSolutionsMessages', null, {});
  }
};