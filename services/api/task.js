import { gql } from 'nuxt-graphql-request/utils';

export default {
    /**
     * Retrieve all tasks related to the currently logged-in user
     *
     * @returns {Promise<Array<Object>>} Promise that resolves to an array of task objects.
     */
    async tasks () {
        const query = gql`
            {
                tasks {
                    id
                    title
                    status
                }
            }`;

        const $nuxtApp = useNuxtApp()
        $nuxtApp.$graphql.task.setHeader('authorization', 'Bearer 17|AyglZIIicswzj1U6u9oB1GzW7IjHlbAOa8vHoxMh13ce6fb9')

        return await $nuxtApp.$graphql.task.request(query);
    },

    /**
     * Creates a new task with the provided title.
     *
     * @param {string} title - The title of the task.
     * @returns {Promise<object>} - A Promise that resolves to an object representing the created task.
     */
    async create (title) {
        const query = gql`
            mutation {
                createTask (
                    title: "${title}"
                ) {
                    id
                    title
                    status
                }
            }`;

        const $nuxtApp = useNuxtApp()
        $nuxtApp.$graphql.task.setHeader('authorization', 'Bearer 17|AyglZIIicswzj1U6u9oB1GzW7IjHlbAOa8vHoxMh13ce6fb9')

        return await $nuxtApp.$graphql.task.request(query);
    },

    /**
     * Updates a task with the specified ID, title, and status.
     *
     * @param {string} id - The ID of the task to update.
     * @param {string} title - The new title for the task.
     * @param {boolean} status - The new status for the task.
     * @returns {Promise<Object>} - A promise that resolves to the updated task object.
     */
    async update (id, title, status) {
        const query = gql`
            mutation {
                updateTask (
                    id: "${id}"
                    title: "${title}"
                    status: ${status}
                ) {
                    id
                    title
                    status
                }
            }`;

        const $nuxtApp = useNuxtApp()
        $nuxtApp.$graphql.task.setHeader('authorization', 'Bearer 17|AyglZIIicswzj1U6u9oB1GzW7IjHlbAOa8vHoxMh13ce6fb9')

        return await $nuxtApp.$graphql.task.request(query);
    },

    /**
     * Delete a single task
     *
     * @param id
     * @returns {Promise<*>}
     */
    async delete (id) {
        const query = gql`
            mutation {
                deleteTask (id: "${id}") {
                    message
                    id
                    success
                }
            }`;

        const $nuxtApp = useNuxtApp()
        $nuxtApp.$graphql.task.setHeader('authorization', 'Bearer 17|AyglZIIicswzj1U6u9oB1GzW7IjHlbAOa8vHoxMh13ce6fb9')

        return await $nuxtApp.$graphql.task.request(query);
    },

    /**
     *
     * @param ids
     * @returns {Promise<*>}
     */
    async bulkDeleteTasks (ids) {
        ids = ids.reduce((acc, cur) => acc += `${cur}, `, '')
        console.log(ids)
        const query = gql`
            mutation {
                bulkDeleteTask (ids: [${ids}]) {
                    message
                    success
                }
            }`;

        const $nuxtApp = useNuxtApp()
        $nuxtApp.$graphql.task.setHeader('authorization', 'Bearer 17|AyglZIIicswzj1U6u9oB1GzW7IjHlbAOa8vHoxMh13ce6fb9')

        return await $nuxtApp.$graphql.task.request(query);
    }
}
