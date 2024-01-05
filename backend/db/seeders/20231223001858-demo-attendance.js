'use strict';
let options={};
if(process.env.NODE_ENV === ' production'){
  options.schema = process.env.SCHEMA
}
const {Attendance} = require('../models')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await Attendance.bulkCreate([
    {
      eventId:1,
      userId:3,
      status:'attending'
    },
    {
      eventId:2,
      userId:1,
      status:'pending'
    }
   ],{validate:true})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
      options.tableName = "Attendances"
      const Op = Sequelize.Op
    await queryInterface.bulkDelete(options,{
      userId:{[Op.in]:[3,1]}
    })
  }
};
