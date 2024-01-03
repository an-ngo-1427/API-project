const express = require('express');
const router = express.Router();

const {Event,Group,Venue,EventImage,User} = require('../../db/models');
const {restoreUser,requireAuth} = require('../../utils/auth.js');
const {validateEvent} = require('../../utils/validation.js');

router.get('/',async (req,res)=>{

    const events = await Event.findAll({
        include:[
            {
                model:User,
                through:{
                    attributes:[]
                }
            },
            {
                model:EventImage
            }
        ]
    });
    const groups  = await Group.findAll({
        attributes:['id','name','city','state']
    })
    const venues = await Venue.findAll({
        attributes:['id','city','state']
    })

    let Events = []
    events.forEach(async event=>{
        event = event.toJSON()
        // getting number of event attendants
        let numAttending = event.Users.length
        event.numAttending = numAttending;

        // getting the group of the event
        groups.forEach(group=>{
            if(group.id === event.groupId){
                event.Group = group
            }
        })

        // getting the venue of the event
        venues.forEach(venue=>{
            if(venue.id === event.venueId){
                event.Venue = venue
            }
        })

        //getting preview image url
        let imageUrl;
        if(!event.EventImages.length){
            imageUrl = "no pictures found"
        }
        event.EventImages.forEach(image=>{
            if(image.preview){
                if(image.url){
                    imageUrl = image.url
                }
            }else{
                imageUrl = "no preview"
            }
        })
        event.previewImage = imageUrl;
        delete event.Users
        delete event.EventImages
        Events.push(event)


    })

    res.json({
        Events,

    })
})

//get details of an event specified by its ID
router.get('/:eventId',async (req,res)=>{
    let event = await Event.findByPk(req.params.eventId,{
        include:{
            model:EventImage,
        }
    });


    if(!event){
        res.statusCode=404;
        return res.json({
            "message": "Event couldn't be found"
        })
    }
    const users = await event.getUsers();
    const numAttending = users.length;

    const group = await Group.findByPk(event.groupId,{
        attributes:['id','name','private','state']
    });
    const venue = await Venue.findByPk(event.venueId,{
        attributes:['id','address','city','state','lat','lng']
    });
    event = event.toJSON();
    event.Group = group;
    event.Venue = venue;
    event.numAttending = numAttending;
    delete event.venueId;
    delete event.groupId;
    res.json({
        ...event
    })
})

//adding eventimages to an event based the ID
router.post('/:eventId/images',[requireAuth],async (req,res)=>{

    const event = await Event.findByPk(req.params.eventId);
    console.log(event)
    if(!event){
        res.statusCode = 404;
        res.json({
            "message": "Event couldn't be found"
        })
    }



    const{url,preview} = req.body;
    console.log(url)
    const newImage = await EventImage.create({

        eventId:req.params.eventId,
        url,
        preview
    })

    res.json(newImage)

})

//editting an event by event ID
router.put('/:eventId',[requireAuth,validateEvent],async (req,res)=>{
    const event = await Event.findByPk(req.params.eventId);
    let {venueId} = req.body;
    if(!event){
        res.statusCode = 404;
        return res.json({
            "message": "Event couldn't be found"
        })
    }
    const venue = await Venue.findByPk(venueId);
    if(!venue){
        res.statusCode = 404
       res.json({
           "message": "Venue couldn't be found"
       })

    }

    const group = await Group.findByPk(event.groupId)

    if(req.user.id !== group.organizerId){
        res.statusCode = 403
        return res.json({
            "message": "Forbidden"
        })
    }

    const {name,type,capacity,price,description,startDate,endDate} = req.body;

    event.venueId = venueId;
    event.name = name;
    event.type = type;
    event.capacity = capacity;
    event.price = price;
    event.description = description;
    event.startDate = startDate;
    event.endDate = endDate;

    await event.save()


    res.json(event)
})

router.delete('/:eventId',[requireAuth],async(req,res)=>{
    const event = await Event.findByPk(req.params.eventId);

    if(!event){
        res.statusCode = 404;
        return res.json({
            "message": "Event couldn't be found"
        })
    }
    console.log(event)
    console.log(event.groupId)
    const group = await Group.findByPk(event.groupId)

    if(req.user.id !== group.organizerId){
        res.statusCode = 403
        return res.json({
            "message": "Forbidden"
        })
    }

    await event.destroy();
    res.json(
        {
            "message": "Successfully deleted"
          }
    )
})

module.exports = router
