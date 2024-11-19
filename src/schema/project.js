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
});

export default projectSchema;
