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
validator.isNotEmpty = (input) => {
  const result = input ? input.trim() !== '' : false;
  return result;
};

/**
 * Ensures that a string contains alphanumeric characters.
 * @param {String} input The string to verify.
 * @returns {Boolean} Truthy value to tell if the check is successsful or not.
 */
validator.isAlphanumeric = input => /^[a-z0-9]+$/i.test(input);

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
validator.isEmail = input => /^.+?@.+?\..+$/.test(input);

module.exports = validator;
