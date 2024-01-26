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
      },
      {
        name:"Hanging out With Darla Sherman",
        about:"Hanging out with Dory and Nemo, the shark baiters, to get the thrill and piss off the sharks",
        type:"Online",
        private:false,
        city:"Sherman Fish tank",
        state:"Australia",
        organizerId:3,
      },
      {
        name:"Tankhood of the cool fish",
        about:"Nemo, newcomer of orange and white, you have been called forth to the summit of Mount Wannahockaloogie to join with us in the fraternal bonds of tankhood.",
        type:"In person",
        private:false,
        city:"Ocean",
        state:"Pacific Ocean",
        organizerId:4,
      },
      {
        name:"Aquarium Adventure",
        about:"rehabilitation center for marine species. It also incorporates exhibits for educational purposes, such as several aquarium",
        type:"In person",
        private:false,
        city:"Sydney",
        state:"Australia",
        organizerId:2,
      },
      {
        name:"Torpedo research",
        about:"Doing extensive researches on torpedos that are still live on the sunken World War II submarine ",
        type:"Online",
        private:true,
        city:"Ocean",
        state:"Pacific Ocean",
        organizerId:3,
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
    options.tableName = 'Groups'
    const Op = Sequelize.Op
    await queryInterface.bulkDelete(options,{
      name:{[Op.in]:['Finding Nemo','Finding Dory','Shark Baiting','Tankhood of the cool fish','Aquarium Adventure','Torpedo research','Hanging out With Darla Sherman']}
    })
  }
};
