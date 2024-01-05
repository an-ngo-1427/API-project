const express = require('express');
const router = express.Router();

const {GroupImage,Membership,Group} = require('../../db/models');
const {requireAuth} = require('../../utils/auth.js');

router.delete('/:imageId',[requireAuth],async (req,res)=>{
    const groupImage = await GroupImage.findByPk(req.params.imageId,{
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



    if(coHost[0] || req.user.id === organizerId){
        await groupImage.destroy()
        return res.json({
            "message": "Successfully deleted"
        })

    }
    res.statusCode = 403;
    return res.json({
        'message':'Forbidden'
    })
})
module.exports = router
