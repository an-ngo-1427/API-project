const express = require('express');
const router = express.Router();

const {Event,Group,Venue,EventImage,User,Attendance,Membership} = require('../../db/models');
const {restoreUser,requireAuth,verifyStatus} = require('../../utils/auth.js');
const {validateEvent,validateQuery} = require('../../utils/validation.js');
const {Op} = require('sequelize')
router.get('/',validateQuery,async (req,res)=>{
    const {page,size,name,type,startDate} = req.query;

    let queryObj={where:{}};
    queryObj.limit = size;
    queryObj.offset = size * (page-1);

    if(name){
        queryObj.where.name = name;
    }
    if(type){
        queryObj.where.type = type
    }
    if(startDate){
        queryObj.where.startDate = startDate;
    }

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
        ],
        ...queryObj
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

    if(!event){
        res.statusCode = 404;
        res.json({
            "message": "Event couldn't be found"
        })
    }

    const group = await Group.findByPk(event.groupId)

    const attendee = await Attendance.findOne({
        where:{
            eventId:event.id,
            userId:req.user.id,
            status:'attending'
        }
    })

    const coHost = await group.getUsers({
        through:{
            where:{
                userId:req.user.id,
                status:'co-host'
            }
        }
    })
    console.log(req.user.id);
    console.log(group.organizerId);
    console.log(attendee)
    if(attendee || coHost[0] || req.user.id === group.organizerId){
        const{url,preview} = req.body;

        let newImage = await EventImage.create({

            eventId:req.params.eventId,
            url,
            preview
        })

        newImage = newImage.toJSON();
        delete newImage.updatedAt;
        delete newImage.createdAt;
        delete newImage.eventId;
        return res.json(newImage)

    }

    res.startCode = 403;
    res.json({
        'message':'Forbidden'
    })

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

    console.log(req.user.id)
    if(coHost[0] || req.user.id == group.organizerId){
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
// deleteing events
router.delete('/:eventId',[requireAuth],async(req,res)=>{
    const event = await Event.findByPk(req.params.eventId);
    if(!event){
        res.statusCode = 404;
        return res.json({
            "message": "Event couldn't be found"
        })
    }

    const group = await Group.findByPk(event.groupId)
    const coHost = await group.getUsers({
        through:{
            where:{
                userId: req.user.id,
                status:'co-host'
            }
        }
    })
    if(coHost[0] || req.user.id === group.organizerId){
        await event.destroy();
        return res.json(
            {
                "message": "Successfully deleted"
              }
        )

    }

        res.statusCode = 403
        return res.json({
            "message": "Forbidden"
        })


})

// requesting attendance to en event
router.post('/:eventId/attendance',[requireAuth],async (req,res)=>{

    const event = await Event.findByPk(req.params.eventId)
    if(!event){
        res.statusCode = 404;
        return res.json({
            "message": "Event couldn't be found"
        })
    }


    const membership = await Membership.findOne({
        where:{
            userId:req.user.id,
            groupId:event.groupId
        }
    })

    if(!membership){
        res.statusCode = 404;
        return res.json({
            'message':'Forbidden'
        })
    }
    if(membership.status === 'pending'){
        res.statusCode = 403;
        return res.json({
            'message':'Forbidden'
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
    console.log(attendance)
    if(attendance.status === 'attending'){
        res.statusCode = 404;
        return res.json({
            "message": "User is already an attendee of the event"
        })
    }

    if(attendance.status === 'waitlist' || attendance.status === 'pending'){
        res.statusCode = 404;
        return res.json({
            "message": "Attendance has already been requested"
        })
    }



})

// changin attendance status
router.put('/:eventId/attendance',[requireAuth,verifyStatus],async (req,res)=>{
    const event = await Event.findByPk(req.params.eventId);
    if(!event){
        res.statusCode =404;
        return res.json({
            "message": "Event couldn't be found"
        })
    }

    const user = await User.findByPk(req.body.userId)
    if(!user){
        res.statusCode = 404;
        return res.json({
            "message": "User couldn't be found"
        })
    }


    const group = await Group.findByPk(event.groupId);
    const coHost = await group.getUsers({
        through:{
            where:{
                userId:req.user.id,
                status:'co-host'
            }
        }
    })
    const attendance = await Attendance.findOne({
        where:{
            userId:user.id,
            eventId:req.params.eventId
        }
    })

    if(!attendance){
        res.statusCode = 404;
        res.json({
            "message": "Attendance between the user and the event does not exist"
        })
    }

    if(coHost[0] || req.user.id == group.organizerId){
        attendance.status = req.body.status;
        attendance.save();
        console.log(attendance)
        return res.json(attendance)
    }

    res.statusCode = 403;
    res.json({
        'message':'Forbidden'
    })
})

//deleting attendance
router.delete('/:eventId/attendance/:userId',[requireAuth],async (req,res)=>{
    const event = await Event.findByPk(req.params.eventId,{
        include:User
    });
    if(!event){
        res.statusCode = 404;
        return res.json({
            "message": "Event couldn't be found"
        })
    }

    const group = await Group.findByPk(event.groupId)
    const coHost = await Membership.findOne({
        where:{
            userId:req.user.id,
            status:'co-host'
        }
    })

    let user = await User.findByPk(req.params.userId);
    if(!user){
        res.statusCode = 404;
        return res.json({
            "message": "User couldn't be found"
        })
    }

    const attendance = await Attendance.findOne({
        where:{
            userId:req.params.userId
        }
    })

    if(!attendance){
        res.statusCode = 404;
        return res.json({
            "message": "Attendance does not exist for this User"
        })
    }

    if(coHost || req.user.id === group.organizerId || req.userId === attendance.userId){
        await attendance.destroy();
        res.json({
            "message": "Successfully deleted attendance from event"
        })
    }

    res.statusCode = 403;
    res.json({
        'message':'Forbidden'
    })




})
// getting all the attendees of an event by specified ID
router.get('/:eventId/attendees',async (req,res)=>{
    const event = await Event.findByPk(req.params.eventId,{
    })
    if(!event){
        res.statusCode = 404;
        res.json({
            "message": "Event couldn't be found"
        })
    }

    const group = await Group.findByPk(event.groupId)

    const coHost = await group.getUsers({
        through:{
            where:{
                userId:req.user.id,
                status:'co-host'
            }
        }
    })

    let queryObj = {where:{}};

    if(coHost[0] || req.user.id === group.organizerId){
        queryObj.where.status = { [Op.in]:['attending','waitlist','pending']}
    }else{
        queryObj.where.status = {[Op.in]:['attending','waitlist']}
    }

    const Attendees = await event.getUsers({
        through:{
            ...queryObj,
        },
        joinTableAttributes:['status'],
        attributes:{
            exclude:['username']
        }
    })

    res.json({Attendees})
})
module.exports = router
