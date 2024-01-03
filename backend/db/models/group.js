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
      Group.belongsToMany(models.User,{
        through:models.Membership,
        foreignKey:'groupId',
        otherKey:'userId'
      })

      Group.belongsTo(models.User,{
        foreignKey:'organizerId'
      })

      Group.belongsToMany(models.Venue,{
        through:models.Event,
        foreignKey:'groupId',
        otherKey:'venueId'
      })

      Group.hasMany(models.Venue,{
        foreignKey:'groupId',
        onDelete:'CASCADE',
        hooks:true
      })



      Group.hasMany(models.GroupImage,{
        foreignKey:'groupId',
        onDelete:'CASCADE',
        hooks:true
      })


    }
  }
  Group.init({
    name:{
      type: DataTypes.STRING(60),
      validate:{
        isShort(value){
          if(value.length > 60){
            throw new Error("Name must be 60 characters or less")
          }
        }
      }
    },
    about:{
      type:DataTypes.STRING,
      validate:{
        isLong(value){
          if (value.length <50){
            throw new Error("About must be 50 characters or more")
          }
        }
      }
    },
    type: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        isIn:{
          args:[['Online','In person']],
          msg:"Type must be 'Online' or 'In person"
        },
      }
    },
    private: {
      type:DataTypes.BOOLEAN,
      allowNull:false
    },
    city:{
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{
          msg:"City is required"
        }
      }
    },
    state:{
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{
          msg:"State is required"
        }
      }
    },
    organizerId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Group',
    defaultScope:{
      attributes:{
        exclude:['createdAt','updatedAt']
      }
    },
  });
  return Group;
};
