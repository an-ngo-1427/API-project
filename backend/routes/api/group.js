const express = require('express');
const {Group,User,GroupImage,Venue,Event,Membership} = require('../../db/models');
const {check} = require('express-validator')
const sequelize = require('sequelize')
router = express.Router();
const {restoreUser,requireAuth} = require('../../utils/auth.js')
const {handleValidationErrors,validateGroup,validateVenue,validateEvent} = require('../../utils/validation.js')

function getGroups(groups){
    let groupList=[]

    groups.forEach(group=>{
        //obtaining user numbers for each group and assign the numbers to the group object property
        let userNum = group.Users.length
        //obtaining image urls if preview Image is true
        let imageUrl;
        let images = group.GroupImages;
        if(!images.length){
            imageUrl = 'no pictures found'
        }
        images.forEach(image=>{
            if(image.preview === true){
                imageUrl = image.url
            }else{
                imageUrl = "no pictures"
            }

        })

        group = group.toJSON();
        group.numMembers = userNum;
        group.previewImage = imageUrl;
        groupList.push(group)


    })


    groupList.forEach(async group =>{
        delete group.Users
        delete group.GroupImages

    })

     return groupList;
}
// getting all groups
router.get('/',async (req,res)=>{

    let groups = await Group.findAll({
        include:[
            {
                model:User
            },
            {
                model:GroupImage
            }
        ]
    });
   groups = getGroups(groups);


    res.json({
        groups
    })
})

//get groups of the current user
router.get('/current',[restoreUser,requireAuth],async (req,res)=>{
    const user = req.user
    let groups = await Group.findAll({
        include:[
            {
                model:User
            },
            {
                model:GroupImage
            }
        ],
        through:{
            where:{
                userId:req.user.id
            }
        }
    })

    groups = getGroups(groups)

    res.json({
        groups
    })

})

//get group details by specific id
router.get('/:groupId',async (req,res)=>{
    let group = await Group.findByPk(req.params.groupId,{
        include:[
            {
                model:GroupImage
            },
            {
                model:Venue,
                through:{
                    attributes:[]
                }
            },
            {
                model:User
            }
        ]
    });
    if(!group){
        res.statusCode = 404;
        return res.json({
            message:"Group couldn't be found"
        })
    }
    let organizer = await group.getUser()
    organizer = organizer.toJSON();
    delete organizer.username;
    console.log('user',organizer)


    let userNum = group.Users.length;
    group = group.toJSON();
    group.numMembers = userNum;
    group.organizerId = organizer;
    delete group.Users
    res.json({
        group
    })
})





//creating a new group
router.post('/',[restoreUser,requireAuth,validateGroup],async (req,res)=>{
    const {name,about,type,city,state,private} = req.body;


    const newGroup = await Group.create({
        organizerId:req.user.id,
        name,
        about,
        type,
        city,
        private,
        state
    })

    res.json({
        newGroup

    })
})


//creating new image for specified group
router.post('/:groupId/images',[restoreUser,requireAuth],async (req,res)=>{

    const group = await Group.findByPk(req.params.groupId)
    if(!group){
        res.statusCode = 404
        return res.json({
            "message": "Group couldn't be found"

        })
    }

    if(req.user.id !== group.organizerId){
        res.statusCode = 403
        return res.json({
            "message": "Forbidden"
        })
    }
    const {imgUrl,preview} = req.body
    const newImage = await GroupImage.create({
        groupId:req.params.groupId,
        url:imgUrl,
        preview
    })

    res.json({
        newImage
    })
})

// editting group
router.put('/:groupId',[restoreUser,requireAuth,validateGroup],async(req,res)=>{
    const group = await Group.findByPk(req.params.groupId)
    if(!group){
        res.statusCode = 404
        return res.json({
            "message": "Group couldn't be found"
        })
    }
    if(req.user.id !== group.organizerId){
        res.statusCode = 403
        return res.json({
            "message": "Forbidden"
        })
    }

    const{name,about,type,private,city,state} = req.body
    group.name = name
    group.about = about
    group.type = type
    group.private = private
    group.city = city
    group.state = state

    res.json({
        group
    })
})

// deleting an existing group
router.delete('/:groupId',[restoreUser,requireAuth],async(req,res)=>{
    const group = await Group.findByPk(req.params.groupId)
    if(!group){
        res.statudCode = 404;
        return res.json({
            "message": "Group couldn't be found"
        })
    }
    if(req.user.id !== group.organizerId){
        res.statusCode = 403
        return res.json({
            "message": "Forbidden"
        })
    }

    await group.destroy();
    res.json({
        "message": "Successfully deleted"
    })
})

//get all venues for a specified group id
router.get('/:groupId/venues',[restoreUser,requireAuth],async(req,res)=>{
    const group = await Group.findByPk(req.params.groupId)
    if(!group){
        res.statusCode = 404;
        return res.json({
            "message": "Group couldn't be found"
        })
    }
    if(req.user.id !== group.organizerId){
        res.statusCode = 403
        return res.json({
            "message": "Forbidden"
        })
    }

    const venues = await group.getVenues;

    res.json({
        venues
    })
})

//creating a new venue for a specified group Id
router.post('/:groupId/venues',[restoreUser,requireAuth,validateVenue],async (req,res)=>{
    const group = await Group.findByPk(req.params.groupId)
    if(!group){
        res.statusCode = 404;
        return res.json({
            "message": "Group couldn't be found"
        })
    }
    if(req.user.id !== group.organizerId){
        res.statusCode = 403
        return res.json({
            "message": "Forbidden"
        })
    }
    const{address,city,state,lat,lng} = req.body
    const newVenue = await Venue.create({
        groupId:req.params.groupId,
        address,
        city,
        state,
        lat,
        lng
    })

    res.json({
        newVenue
    })
})

// getting all events of a group by specified id
router.get('/:groupId/events',async (req,res)=>{
    const group = await Group.findByPk(req.params.groupId);

    if(!group){
        res.statudCode=404;
        return res.json({
            "message": "Group couldn't be found"
        })
    }
    const events =  await Event.findAll({
       where:{
        groupId:group.id
       }
    });
    res.json({
        events
    })
})

// creating an event for a group by specified ID
router.post('/:groupId/events',[requireAuth,validateEvent],async (req,res)=>{

    const group = await Group.findByPk(req.params.groupId)

    if(!group){
        res.statusCode = 404;
        return res.json({
            "message": "Group couldn't be found"
        })
    }

    if(req.user.id !== group.id){
        res.statusCode = 403;
        return res.json({
            "message": "Forbidden"
        })
    }


    const venue = await Venue.findByPk(req.body.venueId);
    if(!venue){
        res.statusCode = 404;
        return res.json({
            "message":"Venue couldn't be found"
        })
    }


    const{name,type,capicity,price,description,startDate,endDate} = req.body;

    const newEvent = await Event.create({
        groupId:parseInt(req.params.groupId),
        venueId:req.body.venueId,
        name,
        type,
        capicity,
        price,
        description,
        startDate,
        endDate
    })
    res.json({
        newEvent
    })



});









module.exports = router;
