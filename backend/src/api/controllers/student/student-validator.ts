import * as Joi from "joi";

export const jwtValidator = Joi.object().keys({
    authorization: Joi.string().required(),
}).unknown();

export const createStudentValidator = Joi.object().keys({
    cpf: Joi.string().trim().length(11).required(),
    name: Joi.string().trim().max(100).required(),
    email: Joi.string().trim().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    gender: Joi.string().trim().valid('masculine', 'feminine', 'other').required(),
    phone: Joi.string().trim().max(25).required()
}).required();

export const findStudentByCpf = Joi.object().keys({
    cpf: Joi.string().trim().length(11).required(),
}).required();

export const deactivateStudent = Joi.object().keys({
    cpf: Joi.string().trim().length(11).required(),
}).required();

export const reactivateStudent = Joi.object().keys({
    cpf: Joi.string().trim().length(11).required(),
}).required();

export const updateStudent = Joi.object().keys({
    cpf: Joi.string().trim().length(11).required(),
    name: Joi.string().trim().max(100),
    email: Joi.string().trim().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    gender: Joi.string().trim().valid('masculine', 'feminine', 'other'),
    phone: Joi.string().trim().max(25)
}).required();