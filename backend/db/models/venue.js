'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Venue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Venue.belongsToMany(models.Group,{
        through:models.Event,
        foreignKey:'venueId',
        otherKey:'groupId'

      })

      Venue.belongsToMany(models.Group,{
        through:models.Event,
        foreignKey:'venueId',
        otherKey:'groupId'
      })

      Venue.belongsTo(models.Group,{
        foreignKey:'groupId'
      })
    }
  }
  Venue.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    groupId: DataTypes.INTEGER,
    address:{
      type:DataTypes.TEXT,
      // allowNull:false,
      validate:{
        notEmpty:{
          msg:"Street address is required"
        }

      }
    } ,
    city: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notEmpty:{
          msg:"City is required"
        }
      }
    },
    state:{
      type:  DataTypes.STRING,
      allowNull:false,
      validate:{
        notEmpty:{
          msg:"State is required"
        }
      }
    },
    lat:{
      type:DataTypes.DECIMAL,
      // validate:{
      //   isBetween(value){
      //     if(value<-90 || value >90){
      //       throw new Error('Latitude must be within -90 and 90')
      //     }
      //   }
      // }
    },
    lng:{
      type:DataTypes.DECIMAL,
      // validate:{
      //   isBetween(value){
      //     if(value< -180 || value > 180){
      //       throw new Error('Longitude must be within -180 and 180')
      //     }
      //   }
      // }
    }
  }, {
    sequelize,
    modelName: 'Venue',
    defaultScope:{
      attributes:{
        exclude:['updatedAt','createdAt']
      }
    }
  });
  return Venue;
};
