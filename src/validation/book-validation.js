import Joi from "joi";

const createBookValidation = Joi.object({
    code: Joi.string().min(3).required(),
    title: Joi.string().min(3).required(),
    author: Joi.string().min(3).required(),
    stock: Joi.boolean().optional().default(true)
});

const getBookValidation = Joi.number().min(1).positive().required();


export {
    createBookValidation,
    getBookValidation
};