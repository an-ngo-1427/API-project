const express = require('express')
const router = express.Router();


const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const {check} = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');



// validate signup middleware
const validateSignup = [
    check('firstName')
      .exists({ checkFalsy:true})
      .withMessage('Please provide your first name'),
    check('lastName')
      .exists({ checkFalsy:true})
      .withMessage('Please provide your last name'),
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
  ];


// sign up end point POST /api/users
router.post('/',validateSignup,async (req,res)=>{
    const {email,username,password,firstName,lastName} = req.body;
    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({
        firstName,
        lastName,
        email,
        username,
        hashedPassword
    })

    const safeUser = {
        firstName:user.firstName,
        lastName:user.lastName,
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
