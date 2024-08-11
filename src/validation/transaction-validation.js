import Joi from "joi";

const createBorrowValidation = Joi.object({
    memberCode: Joi.string().min(3).required(),
    bookCode: Joi.string().min(3).required(),
    borrowedDate: Joi.date().required()
});

const createReturnValidation = Joi.object({
    memberCode: Joi.string().min(3).required(),
    bookCode: Joi.string().min(3).required(),
    returnDate: Joi.date().required()
});

export {
    createBorrowValidation,
    createReturnValidation
};