'use strict';
let options = {}
const {Venue} = require('../models')
if (process.env.NODE_ENV === 'production'){
  options.schema = SCHEMA
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
    Venue.bulkCreate([
      {
        address:"575 Bellevue Square",
        city:'Bellevue',
        state:"WA",
        lat: 40,
        lng: -40,
        groupId:1
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

  }
};
