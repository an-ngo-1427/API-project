'use strict';
const{User} = require('../models');
const bcrypt = require('bcryptjs')
let options={};
if(process.env.NODE_ENV === 'production'){
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
    await User.bulkCreate([
      {
        firstName:"Nemo",
        lastName:"Sharkbait",
        email: 'nemo@bluesea.com',
        username: 'thenemo',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName:"Dory",
        lastName:"Forgotten",
        email: 'dory@bluesea.com',
        username: 'thedory',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName:"Darla",
        lastName:"Sherman",
        email: 'darla@sherman.com',
        username: 'darlasherman',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName:"Bruce",
        lastName:"Mate",
        email: 'bruce@mate.com',
        username: 'brucemate',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName:"Crush",
        lastName:"Sweet",
        email: 'crush@sweet.com',
        username: 'crushsweet',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName:"Barracuda",
        lastName:"Killer",
        email: 'barracuda@killer.com',
        username: 'barracuda',
        hashedPassword: bcrypt.hashSync('password')
      },

    ], { validate: true });

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "Users";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options,{

        username:{[Op.in]:['thenemo','thedory','darlasherman']}

    },{});
  }
};
