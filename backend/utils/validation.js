const {validationResult,check,body} = require('express-validator');


const handleValidationErrors = (req,res,next)=>{
    const validtationErrors = validationResult(req);
    if(!validtationErrors.isEmpty()){
        const errors = {};
        validtationErrors
        .array()
        .forEach(error=>errors[error.path] = error.msg);

        const err = Error('Bad request.');
        err.errors = errors;
        err.status = 400;
        err.title = 'Bad request.';
        next(err);
    }
    next();

}

const validateGroup = [
    check('name')
        .exists()
        .isLength({max:60})
        .withMessage("Name must be 60 characters or less"),
    check('about')
        .exists()
        .isLength({min:50})
        .withMessage("About must be 50 characters or more"),
    check('type')
        .exists()
        .isIn(['Online','In person'])
        .withMessage("Type must be 'Online' or 'In person'"),
    check('city')
        .exists({checkFalsy:true})
        .withMessage('City is required'),
    check('state')
        .exists({checkFalsy:true})
        .withMessage("State is required"),
    handleValidationErrors
];

const validateVenue=[
    check('address')
        .exists({checkFalsy:true})
        .withMessage("Street address is required"),
    check('city')
        .exists({checkFalsy:true})
        .withMessage('City is required'),
    check('state')
        .exists({checkFalsy:true})
        .withMessage('State is required'),
    check('lat')
        .custom(value =>{
            if(value < -90 || value > 90){
                throw new Error("Latitude must be within -90 and 90")
            }
            return true
        }),
    check('lng')
        .custom(value =>{
            if(value < -180 || value > 180){
                throw new Error("Longitude must be within -180 and 180")
            }
            return true
        }),

    handleValidationErrors
];

const validateEvent=[
    check('name')
        .isLength({min:5})
        .withMessage("Name must be at least 5 characters"),
    check('type')
        .isIn(['Online','In person'])
        .withMessage("Type must be Online or In person"),
    check('capacity')
        .isInt()
        .withMessage("Capacity must be an integer"),
    check('price')
        .exists({checkFalsy:true})
        .custom(value=>{
            if(value<=0){
                throw new Error("Price is invalid")
            }
            return true
        }),
    check('description')
        .exists({checkFalsy:true,checkNull:true})
        .withMessage("Description is required"),
    check('startDate')
        .toDate()
        .custom(value=>{
            console.log(value)
            if (value.getTime() <= Date.now()){
                throw new Error('Start date must be in the future')
            }
            return true
        }),
    check('endDate')
        .toDate()
        .custom((value,{req})=>{
            if(value.getTime()<= req.body.startDate.getTime()){
                // console.log(req.body.startDate)
                throw new Error('End date is less than start date')
            }
            return true
        }),
    handleValidationErrors
]


module.exports = {
    handleValidationErrors,
    validateGroup,
    validateVenue,
    validateEvent
}
