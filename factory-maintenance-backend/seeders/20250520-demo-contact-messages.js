'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('ContactMessages', [
      {
        name: 'Alice Johnson',
        email: 'alice.johnson@example.com',
        subject: 'Inquiry about pricing',
        message: 'Hello, I would like to know more about your pricing plans.',
        isRead: false,
        isReplied: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Bob Smith',
        email: 'bob.smith@example.com',
        subject: 'Feature request',
        message: 'It would be great if you can add a dark mode to the app.',
        isRead: true,
        isReplied: true,
        createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
        updatedAt: new Date(new Date().setDate(new Date().getDate() - 1))
      },
      {
        name: 'Carol Lee',
        email: 'carol.lee@example.com',
        subject: 'Bug report',
        message: 'I encountered an error when trying to submit the form.',
        isRead: true,
        isReplied: false,
        createdAt: new Date(new Date().setDate(new Date().getDate() - 2)),
        updatedAt: new Date(new Date().setDate(new Date().getDate() - 2))
      },
      {
        name: 'David Kim',
        email: 'david.kim@example.com',
        subject: 'Account deletion',
        message: 'Please delete my account permanently.',
        isRead: false,
        isReplied: false,
        createdAt: new Date(new Date().setDate(new Date().getDate() - 3)),
        updatedAt: new Date(new Date().setDate(new Date().getDate() - 3))
      },
      {
        name: 'Eva Green',
        email: 'eva.green@example.com',
        subject: 'Collaboration proposal',
        message: 'I am interested in collaborating on your next project.',
        isRead: true,
        isReplied: true,
        createdAt: new Date(new Date().setDate(new Date().getDate() - 4)),
        updatedAt: new Date(new Date().setDate(new Date().getDate() - 4))
      },
      {
        name: 'Frank Turner',
        email: 'frank.turner@example.com',
        subject: 'Subscription cancellation',
        message: 'I want to cancel my subscription effective immediately.',
        isRead: false,
        isReplied: false,
        createdAt: new Date(new Date().setDate(new Date().getDate() - 5)),
        updatedAt: new Date(new Date().setDate(new Date().getDate() - 5))
      },
      {
        name: 'Grace Hall',
        email: 'grace.hall@example.com',
        subject: 'Technical support',
        message: 'I need help setting up the software on my computer.',
        isRead: true,
        isReplied: false,
        createdAt: new Date(new Date().setDate(new Date().getDate() - 6)),
        updatedAt: new Date(new Date().setDate(new Date().getDate() - 6))
      },
      {
        name: 'Henry White',
        email: 'henry.white@example.com',
        subject: 'Thank you',
        message: 'Thanks for the great customer service!',
        isRead: true,
        isReplied: true,
        createdAt: new Date(new Date().setDate(new Date().getDate() - 7)),
        updatedAt: new Date(new Date().setDate(new Date().getDate() - 7))
      },
      {
        name: 'Isabel Clark',
        email: 'isabel.clark@example.com',
        subject: 'Feature question',
        message: 'Does your app support multiple languages?',
        isRead: false,
        isReplied: false,
        createdAt: new Date(new Date().setDate(new Date().getDate() - 8)),
        updatedAt: new Date(new Date().setDate(new Date().getDate() - 8))
      },
      {
        name: 'Jack Miller',
        email: 'jack.miller@example.com',
        subject: 'Feedback',
        message: 'Overall, I love the app but some improvements can be made.',
        isRead: true,
        isReplied: true,
        createdAt: new Date(new Date().setDate(new Date().getDate() - 9)),
        updatedAt: new Date(new Date().setDate(new Date().getDate() - 9))
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('ContactMessages', null, {});
  }
};
