const express = require('express');
const {Group,User,GroupImage,Venue,Event,Membership,EventImage} = require('../../db/models');
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
        group = group.toJSON();
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

                        break
                    }

                }else{
                    imageUrl = 'no preview'
                }
            }
        }

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

// getting coHost of a group
async function isCoHost(group,req){
    let coHost = await group.getUsers({
        through:{
            where:{
                userId:req.user.id,
                status:'co-host'
            }
        }
    })
    return coHost;
}
// getting all groups
router.get('/',async (req,res)=>{

    let Groups = await Group.findAll({
        include:[
            {
                model:User
            },
            {
                model:GroupImage
            }
        ],
        attributes:{
            include:['updatedAt','createdAt']
        }
    });
   Groups = getGroups(Groups);


    res.json({
        Groups
    })
})

//get groups of the current user
router.get('/current',[restoreUser,requireAuth],async (req,res)=>{


    let Groups = await Group.findAll({
        include:[
            {
                model:User,
                through:{
                    where:{
                        userId:req.user.id
                    }
                }
            },
            {
                model:GroupImage,
                attributes:{
                    exclude:['updatedAt','createdAt']
                }
            }
        ],
        where:{
            organizerId:req.user.id
        },
        attributes:{
            include:['createdAt','updatedAt']
        }
    })

    Groups = getGroups(Groups)

    res.json({
        Groups
    })
})

//get group details by specific id
router.get('/:groupId',async (req,res)=>{
    let group = await Group.findByPk(req.params.groupId,{
        include:[
            {
                model:GroupImage,
                attributes:{
                    exclude:['updatedAt','createdAt','groupId']

                }
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
        ],
        attributes:{
            include:['updatedAt','createdAt']
        }
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



    let userNum = group.Users.length;
    group = group.toJSON();
    group.numMembers = userNum;
    group.Organizer = organizer;
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
    let group = await Group.findByPk(req.params.groupId,{
        attributes:{
            include:['updatedAt','createdAt']
        }
    })
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
    const coHost = await isCoHost(group,req);

    if(coHost[0] || req.user.id === group.organizerId){
        const Venues = await Venue.findAll({
            where:{
                groupId:req.params.groupId
            }
        });

        return res.json({
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
    if(!group){
        res.statusCode = 404;
        return res.json({
            "message": "Group couldn't be found"
        })
    }
    const coHost = await isCoHost(group,req);

    if(coHost[0] || req.user.id === group.organizerId){
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
        delete Venues.updatedAt;
        delete Venues.createdAt;
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
        res.statusCode=404;
        return res.json({
            "message": "Group couldn't be found"
        })
    }

    let Events=[]
    let allEvents =  await Event.findAll({
        // attributes:{
        //     include:['groupId','venueId']
        // },
        where:{
            groupId:group.id
        },
        attributes:{
            exclude:['description','capacity','price']
        },
        include:[
            {
                model:User,
                through:{
                    where:{
                        status:'attending'
                    }
                }
            },
            {
                model:EventImage
            }

        ]

    });


    const Venues = await Venue.findAll({
        attributes:['id','city','state']
    });
    allEvents.forEach(event=>{
        event = event.toJSON()
        // getting all users attending
        const numUsers = event.Users.length

        // getting venue
        if(!event.venueId) event.Venue = null
        Venues.forEach(venue=>{
            if(venue.id === event.venueId){
                event.Venue = venue;
            }
        })

        // getting image url
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


        event.Group = group;
        event.numAttending = numUsers;
        event.previewImage = imageUrl;
        delete event.Users;
        delete event.EventImages;
        Events.push(event)
    })

    res.json({
        Events
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


    const coHost = await isCoHost(group,req);


    const venue = await Venue.findByPk(req.body.venueId);
    if(!venue){
        res.statusCode = 404;
        return res.json({
            "message":"Venue couldn't be found"
        })
    }


    if(req.user.id === group.organizerId || coHost[0]){

        let{venueId,name,type,capacity,price,description,startDate,endDate} = req.body;
        if(capacity) capacity = parseInt(capacity);
        price = parseFloat(price);
        if(venueId) venueId = parseInt(venueId);
        let newEvent = await Event.create({
            groupId:parseInt(req.params.groupId),
            venueId:venueId,
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


        return res.json(newEvent)

    }

    res.statusCode = 403;
    return res.json({
        "message": "Forbidden"
    })


});

// requesting membership
router.post('/:groupId/membership',[requireAuth],async (req,res)=>{
    const group = await Group.findByPk(req.params.groupId)
    if(!group){
        res.statusCode = 404;
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
    const coHost = await isCoHost(group,req);

    const organizer = await group.getUser();


    if((coHost[0] || req.user.id === organizer.id) && (status === 'member')){
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
    const coHost = await isCoHost(group,req);



    if(coHost[0] || group.organizerId === req.user.id){
        let Members = await group.getUsers({
            attributes:{
                exclude:['username']
            },
            joinTableAttributes:['status']

        });

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
        attributes:{
            exclude:['username']
        },
        joinTableAttributes:['status']

    })

    res.json({Members})


})

// deleting a user from group
router.delete('/:groupId/membership/:memberId',[requireAuth],async (req,res)=>{
    const user = await User.findByPk(req.params.memberId)
    if(!user){
        res.statusCode = 404;
        return res.json({
            "message": "User couldn't be found"
        })
    }
    const group = await Group.findByPk(req.params.groupId);
    if(!group){
        res.statusCode = 404;
        return res.json({
            'message':"Group couldn't be found"
        })
    }
    const membership = await Membership.findOne({
        where:{
            userId:req.params.memberId
        }
    })

    if(!membership){
        res.statusCode = 404;
        return res.json({
            "message": "Membership does not exist for this User"
        })
    }
    const organizer = await group.getUser()
    const reqUserStatus = await Membership.findOne({
        where:{
            userId:req.user.id
        }
    })

    if(!reqUserStatus){
        res.statusCode = 403;
        return res.json({
            'message':'Forbidden'
        })
    }

    if(req.user.id ==  req.params.memberId){
        await membership.destroy();
        return res.json({
            "message": "Successfully deleted membership from group"
        })
    }

    if((reqUserStatus.status !== "co-host") || (organizer.id !== req.user.id)){
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



    await membership.destroy();
    res.json({
        "message": "Successfully deleted membership from group"
    })
})









module.exports = router;
