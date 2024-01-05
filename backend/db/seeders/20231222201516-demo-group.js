'use strict';
let options = {};
if(process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA
}
const {Group} = require('../models')
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
    await Group.bulkCreate([
      {
        name:"Finding Nemo",
        about:"Looking for Nemo party. Looking for Nemo who has been lost in the ocean ",
        type:"In person",
        private:false,
        city:"Sydney",
        state:"New South Wales",
        organizerId:2,
      },
      {
        name:"Finding Dory",
        about:"Looking for Dory party. Looking for Dory who is looking for Nemo who is lookfir for his son Marlin",
        type:"In person",
        private:true,
        city:"The Reef",
        state:"Pacific Ocean",
        organizerId:1,
      },
      {
        name:"Shark Baiting",
        about:"Hanging out with Dory and Nemo, the shark baiters, to get the thrill and piss off the sharks",
        type:"Online",
        private:false,
        city:"The Sharks' lair ",
        state:"Pacific Ocean",
        organizerId:1,
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
    options.tableName = 'Groups'
    const Op = Sequelize.Op
    await queryInterface.bulkDelete(options,{
      name:{[Op.in]:['Finding Nemo','Finding Dory','Shark Baiting']}
    })
  }
};
