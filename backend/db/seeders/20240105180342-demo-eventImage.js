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
      url:'https://i.cbc.ca/1.5250351.1565984976!/fileImage/httpImage/image.jpg_gen/derivatives/16x9_780/finding-dory.jpg',
      preview:true
    },
    {
      eventId:2,
      url:'https://images.squarespace-cdn.com/content/v1/51cdafc4e4b09eb676a64e68/1470759850224-5IC6BYVMVV4KW5PGT61D/Marlin11.jpg',
      preview:false
    },
    {
      eventId:3,
      url:'https://img.huffingtonpost.com/asset/573fee0a1a00008800c293b2.jpeg',
      preview:true
    },
    {
      eventId:4,
      url:'https://images.ctfassets.net/m3qyzuwrf176/7oc4aVvtKi1E5gPwVI3SJ7/caa797db02498366ab7ff27c5cc1f43b/Jul29_FINDING_NEMO_Matinees10MHL-banner.jpg',
      preview:true
    },
    {
      eventId:5,
      url:'https://protecttheoceans.org/wordpress/wp-content/uploads/2013/09/FindingNemoSharks.jpg',
      preview:true
    },
    {
      eventId:6,
      url:'https://sweetanimatedfilms.files.wordpress.com/2016/05/findingnemo2-2.jpg',
      preview:true
    },
    {
      eventId:1,
      url:'https://assets.bigcartel.com/product_images/186576971/nemo.jpg',
      preview:true
    },
    {
      eventId:2,
      url:'https://i.pinimg.com/474x/a6/0e/89/a60e898b3149cf84544164c3fbe7d42b.jpg',
      preview:true
    },
    {
      eventId:3,
      url:'https://i.pinimg.com/564x/a8/b5/35/a8b535046072f333c7c9171b8cd1f90c.jpg',
      preview:true
    },
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
      eventId:{[Op.in]:[1,2,3]}
    })
  }
};
