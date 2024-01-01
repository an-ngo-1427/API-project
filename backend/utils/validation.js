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


module.exports = {
    handleValidationErrors,
    validateGroup,
    validateVenue
}
