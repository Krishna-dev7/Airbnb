const joi = require("joi");
const CustomError = require("./CustomError");

const reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().min(1).max(5).required(),
        comment: joi.string().required()
    }).required()
});

function validateReview(req, res, next) {
    let result = reviewSchema.validate(req.body);
    if(result.error) {
        console.log(result.error.details);
        throw new CustomError(400, result.error.details[0].message);
    }
    next();
}

module.exports = validateReview;