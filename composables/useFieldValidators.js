import { email, required } from '~/utils/validator.js';

/**
 * Exposes validator rules for fields. We can do this because the app is fairly small
 *
 * @returns {{emailRule: (function(*): (boolean|string))[], passwordRule: (function(*): (boolean|string))[]}}
 */
export const useFieldValidators = () => {
    /**
     * Used in the login screen
     * @type {(function(*): (boolean|string))[]}
     */
    const emailRule = [
        required('Please enter your email'),
        email()
    ]

    /**
     * used in the login screen
     * @type {(function(*): (boolean|string))[]}
     */
    const passwordRule = [required('Please enter your password')]

    return {
        emailRule,
        passwordRule
    }
}
