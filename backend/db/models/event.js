'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.belongsTo(models.Group,{
        foreignKey:'groupId'
      })

      Event.belongsTo(models.Venue,{
        foreignKey:'VenueId',
      })
    }
  }
  Event.init({
    name:{
      type:DataTypes.STRING,
      validate:{
        isLongerthan(value){
          if(value.length<5){
            throw new Error('Name must be at least 5 characters')
          }
        }
      }
    },
    description: DataTypes.STRING,
    type: DataTypes.STRING,
    capacity: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    startDate: DataTypes.DATE(6),
    endDate: DataTypes.DATE(6),
    venueId:DataTypes.INTEGER,
    groupId:DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
