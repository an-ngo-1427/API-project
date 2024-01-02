const express = require('express');
const router = express.Router();

const {Event,Group,Venue,EventImage} = require('../../db/models');
const {restoreUser,requireAuth} = require('../../utils/auth.js');

router.get('/',async (req,res)=>{
    const events = await Event.findAll({
        include:[
            {
                model:Group,
                attributes:['id','name','city','state']
            },
            {
                model:Venue,
                attributes:['id','city','state']
            }
        ]
    });
    res.json({
        events
    })
})

//get details of an event specified by its ID
router.get('/:eventId',async (req,res)=>{
    const event = await Event.findByPk(req.params.eventId,{
        include:[
            {
                model:Group
            },
            {
                model:Venue
            },
            {
                model:EventImage
            }
        ]
    });

    if(!event){
        res.statusCode=404;
        return res.json({
            "message": "Event couldn't be found"
        })
    }
    res.json({
        event
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



    const{url,preview} = req.body;

})

module.exports = router
