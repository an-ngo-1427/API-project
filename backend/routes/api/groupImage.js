const express = require('express');
const router = express.Router();

const {GroupImage,Membership,Group} = require('../../db/models');

router.delete('/:imageId',async (req,res)=>{
    const groupImage = await GroupImage.findByPk(req.params.imageId,{
        attributes:['groupId']
    });
    if(!groupImage){
        res.statusCode = 404;
        return res.json({
            "message": "Group Image couldn't be found"
        })
    }

    const group = await Group.findByPk(groupImage.groupId);
    const organizerId = group.organizerId
    let coHost = await group.getUsers({
        through:{
            where:{
                userId:req.user.id,
                status:'co-host'
            }
        }
    })


    if(coHost || req.user.id === organizerId){
        await groupImage.destroy()
        res.json({
            "message": "Successfully deleted"
        })

    }
    res.statusCode = 403;
    return res.json({
        'message':'Forbidden'
    })
})
module.exports = router
