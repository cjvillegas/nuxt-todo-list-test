import { gql } from 'nuxt-graphql-request/utils';
import { authedClient } from '~/services/api/client.js';

export default {
    /**
     * Logs in a user with the provided username and password.
     *
     * @param {string} username - The username of the user.
     * @param {string} password - The password of the user.
     * @returns {Promise} - A promise that resolves to the response of the login request.
     */
    async login (username, password) {
        const query = gql`
            mutation {
                login (
                    email: "${username}",
                    password: "${password}"
                ) {
                    user {
                        id
                        first_name
                        last_name
                        email
                    }
                    token
                }
            }`;

        const $nuxtApp = useNuxtApp()
        return await $nuxtApp.$graphql.default.request(query)
    },

    /**
     * Logs out the user.
     *
     * @returns {Promise<void>} A promise that resolves when the user is successfully logged out.
     */
    async logout () {
        const query = gql`
            mutation {
                logout
            }`;

        return await authedClient('user').$graphql.user.request(query)
    }
}
