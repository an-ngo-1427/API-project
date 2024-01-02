'use strict';


/** @type {import('sequelize-cli').Migration} */
let options={}
if(process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA
}

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
    *
    * Example:
    * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
   options.tableName = "EventImages"
   await queryInterface.addColumn(options,'eventId',{
      type: Sequelize.INTEGER,
      references:{
        model:'Events',
        key:'id'
      },
      onDelete:'CASCADE'
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    options.tableName = "EventImages"
    await queryInterface.removeColumn(options,'eventId')
  }
};
