const express = require('express');
const router = express.Router();

const {Event,Group,Venue,EventImage,User,Attendance,Membership} = require('../../db/models');
const {restoreUser,requireAuth} = require('../../utils/auth.js');
const {validateEvent,validateQuery} = require('../../utils/validation.js');

router.get('/',validateQuery,async (req,res)=>{
    let queryObj={};
    console.log('query',req.query)
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

    res.json(
        {Events}

    )
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
    let newImage = await EventImage.create({

        eventId:req.params.eventId,
        url,
        preview
    })

    newImage = newImage.toJSON();
    delete newImage.updatedAt;
    delete newImage.createdAt;
    delete newImage.eventId;
    res.json(newImage)

})

//editting an event by event ID
router.put('/:eventId',[requireAuth,validateEvent],async (req,res)=>{
    let event = await Event.findByPk(req.params.eventId);
    let {venueId} = req.body;
    if(!event){
        res.statusCode = 404;
        return res.json({
            "message": "Event couldn't be found"
        })
    }
    const group = await Group.findByPk(event.groupId)

    let coHost = await group.getUsers({
        through:{
            where:{
                userId:req.user.id,
                status:'co-host'
            }
        }
    })

    const venue = await Venue.findByPk(venueId);
    if(!venue){
        res.statusCode = 404
       res.json({
           "message": "Venue couldn't be found"
       })

    }


    if(coHost || req.user.id == group.organizerId){
        const {name,type,capacity,price,description,startDate,endDate} = req.body;

        event.venueId = parseInt(venueId);
        event.name = name;
        event.type = type;
        event.capacity = parseInt(capacity);
        event.price = parseFloat(price);
        event.description = description;
        event.startDate = startDate;
        event.endDate = endDate;

        await event.save()

        delete event.updatedAt;
        res.json(event)

    }
    res.statusCode = 403
    return res.json({
        "message": "Forbidden"
    })

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

// requesting attendance to en event
router.post('/:eventId/attendance',[requireAuth],async (req,res)=>{

    const membership = await Membership.findOne({
        where:{
            userId:req.user.id
        }
    })
    console.log(membership)
    const event = await Event.findByPk(req.params.eventId)
    if(!event){
        res.startCode = 404;
        return res.json({
            "message": "Event couldn't be found"
        })
    }
    if(membership.groupId !== event.groupId){
        res.statusCode = 403;
        return res.json({
            "message":"Forbidden"
        })
    }

    const attendance = await Attendance.findOne({
        where:{
            eventId:event.id,
            userId:req.user.id
        }
    })
    if(!attendance){
        let attendance = await Attendance.create({
            userId:req.user.id,
            eventId:req.params.eventId,
            status:"pending"
        })
        return res.json({
            userId:req.user.id,
            status:attendance.status
        })
    }
    if(attendance.status === 'attending'){
        res.statusCode = 404;
        return res.json({
            "message": "Attendance has already been requested"
        })
    }

    if(attendance.status === 'waitlist' || attendance.status === 'pending'){
        res.statusCode = 404;
        return res.json({
            "message": "Attendance has already been requested"
        })
    }



})
module.exports = router
