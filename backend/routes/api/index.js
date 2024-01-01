// backend/routes/api/index.js
const router = require('express').Router();


const{setTokenCookie,restoreUser,requireAuth} = require('../../utils/auth.js');

//importing routers
const sessionRouter = require('./session.js');
const userRouter = require('./users.js');
const groupRouter = require('./group.js');
const venueRouter = require('./venue.js');
const eventRouter = require('./event.js')

const {User} = require('../../db/models');
router.use(restoreUser);
router.use('/session',sessionRouter);
router.use ('/users',userRouter);
router.use('/groups',groupRouter);
router.use('/venues',venueRouter);
router.use('/events',eventRouter)



router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;
