'use strict';

const { query } = require('express');
const { sequelize } = require('../models');
let options={}
if(process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA
}
options.tableName = "EventImages"
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn(options,'eventId',{
      type:Sequelize.INTEGER,
      references:{
        model:'Events',
        key:'id'
      }
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn(options,'eventId')
  }
};
