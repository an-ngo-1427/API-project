const express = require('express')
const router = express.Router();


const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

router.post('/',async (req,res)=>{
    const {email,username,password} = req.body;
    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({
        email,
        username,
        hashedPassword
    })

    const safeUser = {
        id:user.id,
        username:user.username,
        email:user.email
    }

    await setTokenCookie(res,safeUser);
    res.json({
        user:safeUser
    })
})
module.exports = router;
