const joi = require("joi");
const CustomError = require("./CustomError");


// image: joi.array().max(4)
//     .items(joi.object({
//         url: joi.string().allow("", undefined),
//         filename: joi.string().required()
//     })
// ),

const listingSchema = joi.object({
    listing: joi.object({

        title: joi.string().required(),
        description: joi.string().required(),
        price: joi.number().min(0).required(),
        country: joi.string().required(),
        location: joi.string().required()

    }).required()
})


function validateSchema(req, res, next) {
    const result = listingSchema.validate(req.body);
    if(result.error) {
        console.log(result.error.details);
        console.log(req.body);
        throw new CustomError(400, result.error.details[0].message);
    } else {
        next();
    }
}

module.exports = validateSchema;