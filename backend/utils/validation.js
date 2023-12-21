const {validationResult} = require('express-validator');

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

module.exports = {
    handleValidationErrors
}
