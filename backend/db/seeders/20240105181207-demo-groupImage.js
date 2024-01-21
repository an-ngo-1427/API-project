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
      url:'https://images.squarespace-cdn.com/content/v1/57b7128659cc6869714465b9/1525763557730-6DGSMNJYZO1OZ2LM7NYJ/Screenshot+2018-05-05+11.04.34.png?format=2500w',
      preview:true
    },
    {
      groupId:2,
      url:'https://pyxis.nymag.com/v1/imgs/3ad/b13/85a7c32f1764fadc830991c6e3e5067603-29-finding-dory.2x.rhorizontal.w710.jpg',
      preview:false
    },
    {
      groupId:3,
      url:'https://blenderartists.org/uploads/default/optimized/4X/9/b/6/9b6ffcefae5ba567ce3265ab4bd3d7fa4eff66b6_2_1168x1000.jpeg',
      preview:true
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
      groupId:{[Op.in]:[1,2,3]}
    })
  }
};
