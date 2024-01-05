'use strict';

/** @type {import('sequelize-cli').Migration} */
let options={}
const{EventImage} = require('../models');
if(process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA
}
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
   await EventImage.bulkCreate([
    {
      eventId:1,
      url:'event1image.url',
      preview:true
    },
    {
      eventId:2,
      url:'event2image.url',
      preview:false
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
    const Op = Sequelize.Op
    options.tableName = 'EventImages'
    await queryInterface.bulkDelete(options,{
      eventId:{[Op.in]:[1,2]}
    })
  }
};
