const mongoose = require('mongoose');
const { STATUS } = require('./constants');

/**
 * Validate MongoDB ObjectId format
 * @param {string} id - ID to validate
 * @returns {boolean}
 */
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

/**
 * Validate required field exists and is of expected type
 * @param {any} value - Value to validate
 * @param {string} fieldName - Name of field
 * @param {string} type - Expected type ('string', 'number', 'array', 'object')
 * @returns {string|null} - Error message or null if valid
 */
const validateField = (value, fieldName, type = 'string') => {
  if (!value) {
    return `${fieldName} is required`;
  }

  switch (type) {
    case 'string':
      return typeof value !== 'string' ? `${fieldName} must be a string` : null;
    case 'number':
      return isNaN(value) || value < 0 ? `${fieldName} must be a non-negative number` : null;
    case 'integer':
      return !Number.isInteger(value) || value < 0 ? `${fieldName} must be a non-negative integer` : null;
    case 'array':
      return !Array.isArray(value) || value.length === 0 ? `${fieldName} must be a non-empty array` : null;
    case 'objectId':
      return !isValidObjectId(value) ? `${fieldName} must be a valid MongoDB ID` : null;
    default:
      return null;
  }
};

/**
 * Extract and validate multiple fields from request body or query
 * @param {object} source - Object containing fields (req.body or req.query)
 * @param {object} schema - { fieldName: 'type' } mapping
 * @returns {object} - { isValid: boolean, errors: {} }
 */
const validateFields = (source, schema) => {
  const errors = {};

  Object.entries(schema).forEach(([fieldName, type]) => {
    const error = validateField(source[fieldName], fieldName, type);
    if (error) {
      errors[fieldName] = error;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

module.exports = {
  isValidObjectId,
  validateField,
  validateFields
};
