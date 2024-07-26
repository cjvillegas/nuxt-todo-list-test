/**
 * Validates if a value is required or not and returns a function.
 *
 * @param {string} message - The custom error message to be displayed if the value is not provided.
 * @returns {function(*): boolean|string} - A function that validates if a value is required or not. If the value is not provided,
 * it returns `Field is required` or the custom error message, otherwise returns `true`.
 */
export function required (message = 'Field is required') {
    return (value) => {
        return value ? true : message
    }
}

/**
 * Checks if a value is a valid email address.
 *
 * @param {string} message - The custom error message to be displayed if the value is not a valid email.
 * @returns {function(*): boolean|string} - A function that returns true if the value is a valid email address,
 *   or returns the specified error message if the value is not a valid email address.
 */
export function email (message = 'Invalid email') {
    return (value) => {
        return /.+@.+\..+/.test(value) ? true : message
    }
}

/**
 * Returns a validation function that checks if the length of a value exceeds a given maximum length.
 *
 * @param {number} len - The maximum length allowed.
 * @param {string} message - The error message to be returned if the value exceeds the maximum length.
 * @returns {function(*): string|boolean} - The validation function.
 */
export function maxLen (len = 255, message = 'Invalid value') {
    return (value) => {
        return value?.length > len ? message : true
    }
}
