const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateEducationInput(data){
    let errors = {};
     //check if the data are emptied, if yes then make it empty
    data.school = !isEmpty(data.school) ? data.school : '';
    data.degree = !isEmpty(data.degree) ? data.degree : '';
    data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : '';
    data.from = !isEmpty(data.from) ? data.from : '';

    // use validator to tell the rest to be emptied
    if(Validator.isEmpty(data.school)){
        errors.school = 'school field is required'; 
    }

    if(Validator.isEmpty(data.degree)){
        errors.degree = 'degree field is required'; 
    }    

    if(Validator.isEmpty(data.fieldofstudy)){
        errors.fieldofstudy = 'fieldofstudy field is required'; 
    }

    if(Validator.isEmpty(data.from)){
        errors.from = 'from field is required'; 
    }

    return {
        errors, 
        isValid: isEmpty(errors)
    };
};