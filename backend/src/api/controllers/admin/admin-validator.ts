import * as Joi from 'joi';

export const jwtValidator = Joi.object().keys({
    authorization: Joi.string().required(),
}).unknown();

export const createAdminValidator = Joi.object().keys({
    login: Joi.string().trim().min(8).max(50).required(),
    password: Joi.string().trim().min(8).max(30).required(),
}).required();

export const loginAdmin = Joi.object().keys({
    login: Joi.string().trim().min(8).max(50).required(),
    password: Joi.string().trim().min(8).max(30).required(),
}).required();

export const deactivateAdmin = Joi.object().keys({
    login: Joi.string().trim().min(8).max(50).required(),
}).required();

export const reactivateAdmin = Joi.object().keys({
    login: Joi.string().trim().min(8).max(50).required(),
}).required();