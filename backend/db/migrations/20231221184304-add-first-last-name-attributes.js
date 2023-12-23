'use strict';
let options={};
if(process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA
}
options.tableName = "Users"
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn(options,'firstName',{
      type:Sequelize.STRING,
      allowNull:false
    })

    await queryInterface.addColumn(options,'lastName',{
      type:Sequelize.STRING,
      allowNull:false
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    // options.tableName = "Users";
    await queryInterface.removeColumn(options,'firstName');
    await queryInterface.removeColumn(options,'lastName');
  }
};
