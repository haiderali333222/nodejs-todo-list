import Joi from 'joi';

const projectSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    'string.base': 'Name must be a string.',
    'string.empty': 'Name is required.',
    'string.min': 'Name should be at least 3 characters long.',
    'string.max': 'Name should be at most 50 characters long.',
  }),
  description: Joi.string().max(500).optional().messages({
    'string.base': 'Description must be a string.',
    'string.max': 'Description should not exceed 500 characters.',
  }),
  projectId: Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .required()
  .messages({
    'string.base': 'projectId must be a string.',
    'string.empty': 'projectId is required.',
    'string.pattern.base': 'projectId must be a valid MongoDB ObjectId.',
    'any.required': 'projectId is required.',
  }),
  createdAt: Joi.date().messages({
    'date.base': 'createdAt must be a valid date.',
  }),
  updatedAt: Joi.date().messages({
    'date.base': 'updatedAt must be a valid date.',
  }),
  startDate: Joi.date().required().messages({
    'date.base': 'createdAt must be a valid date.',
    'any.required': 'createdAt is required.',
  }),
  dueDate: Joi.date().required().messages({
    'date.base': 'updatedAt must be a valid date.',
    'any.required': 'updatedAt is required.',
  }),
  doneDate: Joi.date().messages({
    'date.base': 'updatedAt must be a valid date.',
    'any.required': 'updatedAt is required.',
  }),
  status: Joi.string().valid('to-do', 'done').required().messages({
    'string.base': 'Status must be a string.',
    'any.required': 'Status is required.',
    'any.only': 'Status must be either "to-do" or "done".',
  }),
});

export default projectSchema;
