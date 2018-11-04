const validator = {};

/**
 * Ensures that a value is not undefined or null.
 * @param {String} input The value to verify.
 * @returns {Boolean} Truthy value to tell if the check is successsful or not.
 */
validator.isDefined = input => input !== undefined && input !== null;

/**
 * Ensures that a string is not empty.
 * @param {String} input The string to verify.
 * @returns {Boolean} Truthy value to tell if the check is successsful or not.
 */
validator.isNotEmpty = (input) => input && typeof(input) === 'string' ? input.trim() !== '' : false;


/**
 * Ensures that a string contains alphanumeric characters.
 * @param {String} input The string to verify.
 * @returns {Boolean} Truthy value to tell if the check is successsful or not.
 */
validator.isAlphanumeric = typeof(input) === 'string' ? input => /^[a-z0-9]+$/i.test(input) : false;

/**
 * Ensures that a number is an integer.
 * The number to be verified can be a string text or a number value.
 * @param {String} input The number to verify.
 * @returns {Boolean} Truthy value to tell if the check is successsful or not.
 */
validator.isInteger = (input) => {
  if (typeof input === 'string' || typeof input === 'number') {
    return Number.isInteger(Number(input)) || false;
  }
  return false;
};

/**
 * Ensures that an email string is in the correct format.
 * @param {String} input The email string to verify.
 * @returns {Boolean} Truthy value to tell if the check is successsful or not.
 */
validator.isEmail = input => typeof(input) === 'string' ? /^.+?@.+?\..+$/.test(input) : false;

/**
 * Ensures that a string is of a minimum length.
 * @param {String} input The string to verify.
 * @param {Number} minCharCount The minimum length.
 * @returns {Boolean} Truthy value to tell if the check is successsful or not.
 */
validator.minCharLength = (input, minCharCount) => typeof(input) === 'string' ? input.length >= minCharCount : false;

/**
 * Ensures that a string is of a maximum length.
 * @param {String} input The string to verify.
 * @param {Number} maxCharCount The maximum length.
 * @returns {Boolean} Truthy value to tell if the check is successsful or not.
 */
validator.maxCharLength = (input, maxCharCount) => typeof(input) === 'string' ? input.length <= maxCharCount : false;

module.exports = validator;
