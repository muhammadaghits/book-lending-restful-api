import Joi from "joi";

const createMemberValidation = Joi.object({
    code: Joi.string().min(3).required(),
    name: Joi.string().min(3).required(),
    borrowedBook: Joi.number().min(0).max(2).optional().default(0),
    returnDatePreviously: Joi.date().optional(),
    penalty: Joi.boolean().optional().default(false)
});

const getMemberValidation = Joi.number().min(1).positive().required();

export {
    createMemberValidation,
    getMemberValidation
};