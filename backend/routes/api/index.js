// backend/routes/api/index.js
const router = require('express').Router();


const{setTokenCookie,restoreUser,requireAuth} = require('../../utils/auth.js');
const sessionRouter = require('./session.js');
const userRouter = require('./users.js')
const {User} = require('../../db/models');
router.use(restoreUser);
router.use('/session',sessionRouter);
router.use ('/users',userRouter);


router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;
