const express = require('express');
const {Group,User,GroupImage,Venue,Event,Membership} = require('../../db/models');
const {check} = require('express-validator')
const sequelize = require('sequelize')
router = express.Router();
const {restoreUser,requireAuth,verifyStatus} = require('../../utils/auth.js')
const {handleValidationErrors,validateGroup,validateVenue,validateEvent} = require('../../utils/validation.js')
const {Op} =require('sequelize');
const membership = require('../../db/models/membership.js');

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
        }else{
            for (let i=0;i<images.length;i++){
                if(images[i].preview === true){
                    if(images[i].url){
                        imageUrl = images[i].url
                        console.log(imageUrl)
                        break
                    }

                }else{
                    imageUrl = 'no preview'
                }
            }
        }

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
    const user = await User.findByPk(req.user.id)
    let groups = await Group.findAll({
        include:[
            {
                model:User,
                where:{
                    id:req.user.id
                }
            },
            {
                model:GroupImage
            }
        ]
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
                // through:{
                //     attributes:[]
                // }
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
    group.organizer = organizer;
    delete group.Users
    res.json({
        ...group
    })
})





//creating a new group
router.post('/',[restoreUser,requireAuth,validateGroup],async (req,res)=>{
    const {name,about,type,city,state,private} = req.body;


    let newGroup = await Group.create({
        organizerId:req.user.id,
        name,
        about,
        type,
        city,
        private,
        state
    })

    newGroup = newGroup.toJSON()
    res.json({
        ...newGroup

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
    const {url,preview} = req.body
    let newImage = await GroupImage.create({
        groupId:parseInt(req.params.groupId),
        url,
        preview
    })
    newImage = newImage.toJSON()
    delete newImage.updatedAt;
    delete newImage.createdAt;
    delete newImage.groupId
    res.json(
        newImage
    )
})

// editting group
router.put('/:groupId',[restoreUser,requireAuth,validateGroup],async(req,res)=>{
    let group = await Group.findByPk(req.params.groupId)
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

    group.save()

    group = group.toJSON()
    res.json({
        ...group
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
    const group = await Group.findByPk(req.params.groupId);
    if(!group){
        res.statusCode = 404;
        return res.json({
            "message": "Group couldn't be found"
        })
    }
    const coHost = await group.getUsers({
        through:{
            where:{
                userId:req.user.id,
                status:'co-host'
            }
        }
    })
    if(coHost || req.user.id === group.organizerId){
        const Venues = await Venue.findAll({
            where:{
                groupId:req.params.groupId
            }
        });

        res.json({
            Venues
        })

    }
    res.statusCode = 403
        return res.json({
            "message": "Forbidden"
        })

})

//creating a new venue for a specified group Id
router.post('/:groupId/venues',[restoreUser,requireAuth,validateVenue],async (req,res)=>{
    const group = await Group.findByPk(req.params.groupId)
    const coHost = await group.getUsers({
        through:{
            where:{
                userId:req.user.id,
                status:'co-host'
            }
        }
    })

    if(!group){
        res.statusCode = 404;
        return res.json({
            "message": "Group couldn't be found"
        })
    }
    if(coHost || req.user.id === group.organizerId){
        const{address,city,state,lat,lng} = req.body
        let Venues = await Venue.create({
            groupId:parseInt(req.params.groupId),
            address,
            city,
            state,
            lat,
            lng
        })
        Venues = Venues.toJSON()
        return res.json({
            ...Venues
        })

    }
    res.statusCode = 403
    return res.json({
            "message": "Forbidden"
        })
})

// getting all events of a group by specified id
router.get('/:groupId/events',async (req,res)=>{
    const group = await Group.findByPk(req.params.groupId,{
        attributes:['id','name','city','state']
    });
    if(!group){
        res.statudCode=404;
        return res.json({
            "message": "Group couldn't be found"
        })
    }

    let Events=[]
    let allEvents =  await Event.findAll({
        attributes:{
            exclude:['groupId']
        },
        where:{
            groupId:group.id
        }

    });


    const Venues = await Venue.findAll({
        attributes:['id','city','state']
    });
    allEvents.forEach(event=>{
        event = event.toJSON()
        if(!event.venueId) event.Venue = null
        Venues.forEach(venue=>{
            if(venue.id === event.venueId){
                event.Venue = venue;
            }
        })
        event.Group = group
        delete event.venueId;
        Events.push(event)
    })

    res.json({
        Events
    })
})

// creating an event for a group by specified ID
router.post('/:groupId/events',[requireAuth,validateEvent],async (req,res)=>{

    const group = await Group.findByPk(req.params.groupId)
    const coHost = await group.getUsers({
        through:{
            where:{
                userId:req.user.id,
                status:'co-host'
            }
        }
    })


    if(!group){
        res.statusCode = 404;
        return res.json({
            "message": "Group couldn't be found"
        })
    }




    const venue = await Venue.findByPk(req.body.venueId);
    if(!venue){
        res.statusCode = 404;
        return res.json({
            "message":"Venue couldn't be found"
        })
    }

    if(req.user.id === req.user.id || coHost){
        let{name,type,capacity,price,description,startDate,endDate} = req.body;
        capacity = parseInt(capacity);
        price = parseInt(price)
        let newEvent = await Event.create({
            groupId:parseInt(req.params.groupId),
            venueId:parseInt(req.body.venueId),
            name,
            type,
            capacity,
            price,
            description,
            startDate,
            endDate
        })
        newEvent = newEvent.toJSON();
        delete newEvent.updatedAt;
        delete newEvent.createdAt;


        res.json(newEvent)

    }

    res.statusCode = 403;
    return res.json({
        "message": "Forbidden"
    })


});

// requesting membership
router.post('/:groupId/membership',async (req,res)=>{
    const group = await Group.findByPk(req.params.groupId)
    if(!group){
        res.statudCode = 404;
        return res.json(
            {
                "message": "Group couldn't be found"
            }
        )
    }

    const membership = await Membership.findOne({
        where:{
            userId:req.user.id
        }
    })

    if(membership){
        let status = membership.status;
        if(status === "pending"){
            res.statusCode = 400;
            return res.json(
                {
                    "message": "Membership has already been requested"
                  }
            )
        }
        if(status === 'member' || status === 'co-host'){
            res.statusCode = 400;
            return res.json(
                {
                    "message": "User is already a member of the group"
                  }
            )
        }
    }else{
        const memberId = req.user.id
        const status = 'pending'
        await Membership.create({
            groupId:req.params.groupId,
            userId:memberId,
            status
        })
        res.json({
            memberId,
            status
        })
    }

})

// chaning membership status
router.put('/:groupId/membership',[requireAuth,verifyStatus],async (req,res)=>{
    const{memberId,status}=req.body;

    //vefirying user
    const user = await User.findByPk(memberId)
    if(!user){
        res.statusCode = 404;
        return res.json({
            "message": "User couldn't be found"
        })
    }

    //verifying group
    const group = await Group.findByPk(req.params.groupId);
    if(!group){
        res.statusCode = 404;
        return res.json({
            "message": "Group couldn't be found"
        })
    }

    const membership = await Membership.findOne({
        where:{
            userId:memberId
        },
        attributes:{
            exclude:['updatedAt','createdAt']
        }
    })

    //verifying membership
    if(!membership){
        res.statusCode = 404;
        return res.json({
            "message": "Membership between the user and the group does not exist"
        })
    }

    // verifying user status
    const coHost = await Membership.findOne({
        where:{
            userId:req.user.id,
            status:'co-host'
        }
    })

    const organizer = await group.getUser();


    if((coHost || req.user.id === organizer.id) && status === 'member'){
        membership.status = status;
        membership.save()

        return res.json(
            {
                id:membership.id,
                groupId:group.id,
                memberId,
                status
            }
        )
    }

    if(organizer.id == req.user.id && status === 'co-host'){
        console.log('entered')
        membership.status = status;
        membership.save()
        return res.json(
            {
                id:membership.id,
                groupId:group.id,
                memberId,
                status

            }
        )
    }
    console.log('reached')
    res.statusCode=403;
    res.json({
        "message":"Forbidden"
    })
});

// get all group members for a group
router.get('/:groupId/members',async (req,res)=>{
    const group = await Group.findByPk(req.params.groupId)

    if(!group){
        res.statusCode=404;
        return res.json({
            "message": "Group couldn't be found"
        })
    }
    const coHost = await Membership.findOne({
        where:{
            userId:req.user.id,
            status:'co-host'
        }
    })

    const organizer = await group.getUser()

    if(coHost || organizer.id === req.user.id){
        let Members = await group.getUsers({
            attributes:{
                exclude:['username']
            },
            joinTableAttributes:['status']

        });
        console.log(Members);
        return res.json({Members})
    }

    let Members = await group.getUsers({

        through:{
            where:{
                status:{
                    [Op.in]:['co-host','member']
                }
            }
        },
        joinTableAttributes:['status']

    })

    res.json({Members})


})

// deleting a user from group
router.delete('/:groupId/membership/:memberId',[requireAuth],async (req,res)=>{
    const membership = await Membership.findOne({
        where:{
            userId:req.params.memberId
        }
    })

    const group = await Group.findByPk(req.params.groupId);
    const organizer = await group.getUser()
    const reqUserStatus = await Membership.findOne({
        where:{
            userId:req.user.id
        }
    })


    console.log('id',req.user.id);
    console.log(req.params.memberId)
    if(req.user.id ==  req.params.memberId){
        await membership.destroy();
        return res.json({
            "message": "Successfully deleted membership from group"
        })
    }

    if(reqUserStatus.status !== "co-host" || organizer.id !== req.user.id){
        res.statusCode = 403;
        return res.json({
            "message":"Forbidden"
        })
    }
    if(!group){
        res.statusCode=404;
        return res.json({
            "message": "Group couldn't be found"
        })
    }

    const user = await User.findByPk(req.params.memberId)
    if(!user){
        res.statusCode = 404;
        return res.json({
            "message": "User couldn't be found"
        })
    }

    if(!membership){
        res.statusCode = 404;
        return res.json({
            "message": "Membership does not exist for this User"
        })
    }

    await membership.destroy();
    res.json({
        "message": "Successfully deleted membership from group"
    })
})









module.exports = router;
