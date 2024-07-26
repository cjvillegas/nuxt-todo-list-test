/**
 * Creates an authenticated client.
 *
 * @returns {Object} - The authenticated client.
 */
export const authedClient = (schema = 'task') => {
    const $nuxtApp = useNuxtApp()
    $nuxtApp.$graphql[schema].setHeader('authorization', `Bearer ${useState('token').value}`)

    return $nuxtApp;
}
