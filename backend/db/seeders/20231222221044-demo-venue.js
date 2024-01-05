'use strict';
let options = {}
const {Venue} = require('../models')
if (process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA
}
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
    await Venue.bulkCreate([
      {
        address:"575 Bellevue Square",
        city:'Bellevue',
        state:"WA",
        lat: 40,
        lng: -40,
        groupId:1
      },
      {
        address:"123 Trench street",
        city:'The Ocean',
        state:"Pacific Ocean",
        lat: 83,
        lng: -40,
        groupId:2
      },
      {
        address:"746 Great Barrier Reef",
        city:'The Ocean',
        state:"Pacific Ocean",
        lat: 50,
        lng: -70,
        groupId:2
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
    options.tableName = "Venues"
    await queryInterface.bulkDelete(options,{
      groupId:{[Op.in]:[1,2,2]}
    })
  }
};
