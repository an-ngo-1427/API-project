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
      url:'https://i.pinimg.com/564x/39/b4/a7/39b4a75fd3df5b80f0a9516f9e16e9ed.jpg',
      preview:true
    },
    {
      groupId:4,
      url:'https://i.pinimg.com/474x/53/c6/af/53c6afcb50d72489da44353862bb5ce2.jpg',
      preview:true
    },
    {
      groupId:4,
      url:'https://i.pinimg.com/474x/c3/ed/0a/c3ed0a87831fa4f9a0a4cfad3167f5e2.jpg',
      preview:true
    },
    {
      groupId:1,
      url:'https://i.pinimg.com/736x/3a/d6/83/3ad683b9570690d265cfdb97a0323def.jpg',
      preview:true
    },
    {
      groupId:1,
      url:'https://i.pinimg.com/474x/84/ac/9c/84ac9c173bd6be40298e7d4c45c78531.jpg',
      preview:true
    },
    {
      groupId:4,
      url:'https://i.pinimg.com/474x/5a/76/61/5a7661fa9c4755129d691a51d790708f.jpg',
      preview:true
    },
    {
      groupId:2,
      url:'https://i.pinimg.com/474x/51/28/a1/5128a1e9e0385fcc0acca067a69ac60b.jpg',
      preview:true
    },
    {
      groupId:2,
      url:'https://blenderartists.org/uploads/default/optimized/4X/9/b/6/9b6ffcefae5ba567ce3265ab4bd3d7fa4eff66b6_2_1168x1000.jpeg',
      preview:true
    },
    {
      groupId:3,
      url:'https://i.pinimg.com/474x/f8/df/92/f8df92bad8ff496f7941c62d5c8a2cfe.jpg',
      preview:true
    },
    {
      groupId:3,
      url:'https://blenderartists.org/uploads/default/optimized/4X/9/b/6/9b6ffcefae5ba567ce3265ab4bd3d7fa4eff66b6_2_1168x1000.jpeg',
      preview:true
    },
    {
      groupId:5,
      url:'https://i.pinimg.com/474x/d5/d0/09/d5d0091b2e34d2e9dc5041de9f630bba.jpg',
      preview:true
    },
    {
      groupId:6,
      url:'https://i.pinimg.com/474x/e0/ac/8a/e0ac8a9cb4296031285b4761ee9b00f6.jpg',
      preview:true
    },
    {
      groupId:7,
      url:'https://i.pinimg.com/474x/05/01/a5/0501a513eb49bb172d47239836d56179.jpg',
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
      groupId:{[Op.in]:[1,2,3,4]}
    })
  }
};
