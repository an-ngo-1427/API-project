const express = require('express')
const router = express.Router();


const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');

const {check} = require('express-validator');
const {handleValidationErrors} = require('../../utils/validation.js');

// middleware to validate login inputs from users
const validateLogin = [
    check('credential')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Please provide a valid email or username.'),
    check('password')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a password.'),
    handleValidationErrors
  ];


// restore user GET /api/session
router.get('/',(req,res)=>{
    const {user} = req;
    if(user){
        const safeUser = {
            firstName:user.firstName,
            lastName:user.lastName,
            id:user.id,
            username:user.username,
            email:user.email
        }
        return res.json({
            user:safeUser
        });
    }else{
        return res.json({
            user:null
        })
    }
})

// login endpoint POST /api/session
router.post('/',validateLogin,async(req,res,next)=>{
    const{password,credential} = req.body
    const user = await User.unscoped().findOne({
        where:{
            [Op.or]:{
                username:credential,
                email:credential
            }
        }
    })

    if(!user || !bcrypt.compareSync(password,user.hashedPassword.toString())){
        const err = new Error('Login failed');
        err.status = 401;
        err.title = 'Login failer';
        err.errors = {message:'The provided credentials were invalid'};
        return next(err);
    }

    const safeUser = {
        firstName:user.firstName,
        lastName:user.lastName,
        id:user.id,
        email:user.email,
        username:user.username
    }

    await setTokenCookie(res,safeUser);

    return res.json({
        user:safeUser
    })
})


// logout endpoint
router.delete('/',(req,res)=>{
    res.clearCookie('token');
    return res.json({
        message: 'success'
    })
})
module.exports = router;
