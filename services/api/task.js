import { gql } from 'nuxt-graphql-request/utils';
import { authedClient } from '~/services/api/client.js';

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

        return await authedClient().$graphql.task.request(query);
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

        return await authedClient().$graphql.task.request(query);
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

        return await authedClient().$graphql.task.request(query);
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

        return await authedClient().$graphql.task.request(query);
    },

    /**
     *
     * @param ids
     * @returns {Promise<*>}
     */
    async bulkDeleteTasks (ids) {
        ids = ids.reduce((acc, cur) => acc += `${cur}, `, '')
        const query = gql`
            mutation {
                bulkDeleteTask (ids: [${ids}]) {
                    message
                    success
                }
            }`;

        return await authedClient().$graphql.task.request(query);
    }
}
