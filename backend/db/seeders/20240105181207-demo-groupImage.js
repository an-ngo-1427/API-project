'use strict';

/** @type {import('sequelize-cli').Migration} */
let options={}
const{GroupImage} = require('../models');
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
   await GroupImage.bulkCreate([
    {
      groupId:1,
      url:'group1image.url',
      preview:true
    },
    {
      groupId:2,
      url:'group2image.url',
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
    options.tableName = 'GroupImages'
    await queryInterface.bulkDelete(options,{
      groupId:{[Op.in]:[1,2]}
    })
  }
};
