'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Group.belongsTo(models.User,{
        foreignKey:"organizerId",
      })
    }
  }
  Group.init({
    name:{
      type: DataTypes.STRING(60),

    },
    about: DataTypes.STRING(50),
    type: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        isIn:[['Online','In person']]
      }
    },
    private: {
      type:DataTypes.BOOLEAN,
      allowNull:false
    },
    city:{
      type:DataTypes.STRING,
      allowNull:false
    },
    state:{
      type:DataTypes.STRING,
      allowNull:false
    },
    organizerId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
