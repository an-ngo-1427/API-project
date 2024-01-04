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
      // Event.belongsTo(models.Group,{
      //   foreignKey:'groupId'
      // })

      // Event.belongsTo(models.Venue,{
      //   foreignKey:'VenueId',
      // })


      Event.belongsToMany(models.User,{
        through:models.Attendance,
        foreignKey:'eventId',
        otherKey:'userId'
      })

      Event.hasMany(models.EventImage,{
        foreignKey:'eventId',
        onDelete:'CASCADE',
        hooks:true
      })
    }
  }
  Event.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name:{
      type:DataTypes.TEXT,
      validate:{
        isLongerthan(value){
          if(value.length<5){
            throw new Error('Name must be at least 5 characters')
          }
        }
      }
    },
    description: DataTypes.TEXT,
    type: DataTypes.STRING,
    capacity: DataTypes.INTEGER,
    price: DataTypes.DECIMAL,
    startDate: DataTypes.DATEONLY,
    endDate: DataTypes.DATEONLY,
    venueId:DataTypes.INTEGER,
    groupId:DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Event',
    defaultScope:{
      attributes:{
        exclude:['updatedAt','createdAt']
      }
    }
  });
  return Event;
};
