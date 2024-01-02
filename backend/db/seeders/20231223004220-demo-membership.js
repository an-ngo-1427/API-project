'use strict';
let options={};
if(process.env.NODE_ENV==='production'){
  options.schema = process.env.SCHEMA
}

options.tableName = 'Memberships'
const{Membership} = require('../models')
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
   await Membership.bulkCreate([
    {
      userId:1,
      groupId:1,
      status:'active',
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
    await queryInterface.bulkDelete(options,{
      userId:1
    })
  }

};
