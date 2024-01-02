'use strict';
let options = {};
if(process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Groups', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(60)
      },
      about: {
        type: Sequelize.STRING(50)
      },
      type: {
        type: Sequelize.STRING,
        allowNull:false
      },
      private: {
        type: Sequelize.BOOLEAN,
        allowNull:false
      },
      city: {
        type: Sequelize.STRING,
        allowNull:false,
      },
      state: {
        type: Sequelize.STRING,
        allowNull:false
      },
      organizerId: {
        type: Sequelize.INTEGER,
        references:{
          model:'Users',
          key:'id'
        },
        onDelete:'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue:Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue:Sequelize.literal('CURRENT_TIMESTAMP')
      }
    },options);
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "Groups"
    await queryInterface.dropTable(options);
  }
};
