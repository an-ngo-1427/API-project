'use strict';
const {Event} = require('../models')
let options={};
if(process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA
}
options.tableName = "Events"
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
    await Event.bulkCreate([
      {
        venueId:1,
        groupId:1,
        name:"looking for Nemo",
        description:"going out to the ocean with Marlin to look for his son. your safety is not guaranteed",
        type:"Online",
        capacity:123,
        price:12.1,
        startDate: '2024-1-1',
        endDate: '2024-12-12'
      },
      {
        venueId:2,
        groupId:2,
        name:"looking for Dory",
        description:"filled with challenging activities. plenty opportunities to meet great individuals sush as Bruce, Barracuda, Darla Sherman",
        type:"Online",
        capacity:32,
        price:20.1,
        startDate: '2024-1-1',
        endDate: '2024-1-2'
      },
      {
        venueId:1,
        groupId:2,
        name:"Swimming in the Ocean",
        description:"Hanging out with Darla Sherman on the beach. Playing with the fish in the ocean and annoying them",
        type:"In Person",
        capacity:32,
        price:20.1,
        startDate: '2024-3-7',
        endDate: '2024-3-9'
      },
      {
        venueId:1,
        groupId:1,
        name:"Catching Big Fish",
        description:"playing hide and seek with Mr.Johanson in his backyard in the middle of a large sandy pit",
        type:"Online",
        capacity:20,
        price:0,
        startDate: '2024-3-20',
        endDate: '2024-3-25'
      },
      {
        venueId:1,
        groupId:2,
        name:"Aquarium Trip",
        description:"Hanging out with Darla Sherman on the beach. Playing with the fish in the ocean and annoying them",
        type:"In Person",
        capacity:32,
        price:20.1,
        startDate: '2024-5-7',
        endDate: '2024-5-11'
      },
      {
        venueId:1,
        groupId:1,
        name:"Swimming in the Ocean",
        description:"Hanging out with Darla Sherman on the beach. Playing with the fish in the ocean and annoying them",
        type:"In Person",
        capacity:32,
        price:20.1,
        startDate: '2024-5-10',
        endDate: '2024-5-15'
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
    await queryInterface.bulkDelete(options,{
      groupId:{[Op.in]:[1,2]}
    })
  }

};
