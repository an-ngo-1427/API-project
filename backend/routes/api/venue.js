const express = require('express');
const router = express.Router();

const {restoreUser,requireAuth} = require('../../utils/auth.js');
const {handleValidationErrors,validateVenue} = require('../../utils/validation.js');

const {Venue,Group} = require('../../db/models');

router.put('/:venueId',[restoreUser,requireAuth,validateVenue],async (req,res)=>{
    let venue = await Venue.findByPk(req.params.venueId);

    if(!venue){
        res.statusCode = 404;
        return res.json({
            "message": "Venue couldn't be found"
        })
    }
    const group = await Group.findByPk(venue.groupId);

    if(!group){
        res.statusCode= 404;
        return res.json({
            "message": "Group couldn't be found"
        })
    }
    let coHost = await group.getUsers({
        through:{
            where:{
                userId:req.user.id,
                status:'co-host'
            }
        }
    })

    if(coHost[0] || req.user.id === group.organizerId){
        const{address,city,state,lat,lng} = req.body;
        venue.address = address
        venue.city = city
        venue.state = state
        venue.lat = lat
        venue.lng = lng

        await venue.save();

        venue = venue.toJSON();
        delete venue.updatedAt;
        return res.json({
            ...venue
        })

    }
    res.statusCode = 403
        return res.json({
            "message": "Forbidden"
        })

})

module.exports = router
