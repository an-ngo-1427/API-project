const express = require('express');
const router = express.Router();

const {Event,Group,Venue} = require('../../db/models');


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

module.exports = router
