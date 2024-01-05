const express = require('express');
const router = express.Router();

const {Group,User,GroupImage,Venue,Event,Membership,EventImage} = require('../../db/models');

router.delete('/:imageId',async (req,res)=>{
    const eventImage =await  EventImage.findByPk(req.params.imageId,{
        include:Event
    });
    if(!eventImage){
        res.statusCode = 404;
        res.json({
            "message": "Event Image couldn't be found"
        })
    }
    const group = await Group.findByPk(eventImage.Event.groupId);
    let coHost = await group.getUsers({
        through:{
            where:{
                userId:req.user.id,
                status:'co-host'
            }
        }
    });

    if(coHost[0] || group.organizerId === req.user.id ){
        await eventImage.destroy()
        return res.json({
            "message": "Successfully deleted"
        })
    }

    res.statusCode = 403;
    res.json({
        'message':'Forbidden'
    })
})

module.exports = router
