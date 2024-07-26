<script setup>
    import { maxLen, required } from '~/utils/validator.js';
    import { ACTIVE, DONE } from '~/enums/status.js';
    import task from '~/services/api/task.js';
    import auth from '~/services/api/auth.js';

    // refs
    const titleRef = ref()

    // data
    const loading = ref(false)
    const showDeleteConfirmation = ref(false)
    const showNotification = ref(false)
    const notificationText = ref('')
    const showActiveOnly = ref(false)
    const title = ref('');
    const todos = ref([])
    const todo = ref(null)
    const titleRules = [required(), maxLen(255, 'Input title should not be greater than 255')];

    // bulk delete handler
    const showBulkDeleteConfirmation = ref(false)
    const deleteActiveOnly = ref(false)

    const filteredTodos = computed(() => {
        return todos.value.filter((todo) => {
            if (showActiveOnly.value) return todo.status === ACTIVE

            return true
        })
    })

    const openTodosCount = computed(() => todos.value.filter(todo => todo.status === ACTIVE)?.length)
    const doneTodosCount = computed(() => todos.value.filter(todo => todo.status === DONE)?.length)

    async function logout () {
        try {
            const response = await auth.logout();

            if (response) {
                // clear state
                clearNuxtState(['token', 'user', 'authenticated'])

                useRouter().push({path: '/login'})
            }
        } catch (error) {
            console.error(error)
        }
    }

    async function handleSave () {
        const valid = await titleRef.value.validate();
        if (!valid) return

        try {
            loading.value = true
            const { createTask: response } = await task.create(title.value)

            // request failed
            if (!response?.id) {
                showNotifier('Failed to create todo')
                return
            }

            todos.value.unshift(response)

            showNotifier('Todo created successfully')

            title.value = ''
        } catch (error) {
            showNotifier('Failed to create todo')
            console.error(error)
        } finally {
            loading.value = false
        }
    }

    async function updateTodoStatus (item, status) {
        try {
            todo.value = { ...item }
            todo.value.loading = true;
            todo.value.action = 'updating-status'

            const { updateTask: response } = await task.update(
                todo.value.id,
                todo.value.title,
                status
            )

            // request failed
            if (!response?.id) {
                showNotifier('Failed to update todo')
                return
            }

            const index = todos.value.findIndex((t) => t.id === response.id)
            if (index > -1) todos.value.splice(index, 1, response)

            showNotifier('Todo updated successfully')
        } catch (error) {
            showNotifier('Failed to update todo')
            console.error(error)
        } finally {
            todo.value.loading = false
        }
    }

    function bulkDeleteTasks (activeOnly = false) {
        showBulkDeleteConfirmation.value = true
        deleteActiveOnly.value = activeOnly
    }

    function closeBulkDeleteDialog () {
        showBulkDeleteConfirmation.value = false
        deleteActiveOnly.value = false
    }

    /**
     *
     * @returns {Promise<void>}
     */
    async function confirmBulkDeleteTasks () {
        try {
            loading.value = true
            const ids = todos.value.reduce((acc, cur) => {
                if (deleteActiveOnly.value) {
                    cur.status === DONE ? acc.push(cur.id) : ''
                } else {
                    acc.push(cur.id)
                }

                return acc
            }, [])
            const { bulkDeleteTask: response } = await task.bulkDeleteTasks(ids)

            // request failed
            if (!response?.success) {
                showNotifier('Failed to delete todos')
                return
            }

            closeDeleteDialog()

            await refreshTasksList()

            showNotifier('Todos delete successfully')
        } catch (error) {
            showNotifier('An error occurred while deleting todos')
            console.error(error)
        } finally {
            loading.value = false;
            showBulkDeleteConfirmation.value = false
        }
    }

    function removeTodo (item) {
        todo.value = { ...item }
        showDeleteConfirmation.value = true
    }

    function closeDeleteDialog () {
        todo.value = null
        showDeleteConfirmation.value = false
    }

    async function deleteTodo () {
        try {
            todo.value.loading = true;
            todo.value.action = 'deleting'

            const { deleteTask: response } = await task.delete(todo.value.id)

            // request failed
            if (!response?.success) {
                showNotifier('Failed to delete todo')
                return
            }

            const index = todos.value.findIndex((t) => t.id === response.id)
            if (index > -1) todos.value.splice(index, 1)

            closeDeleteDialog()

            showNotifier('Todo deleted successfully')
        } catch (error) {
            showNotifier('An error occurred while trying to delete todo')
            console.error(error)
        } finally {
            if (todo.value) todo.value.loading = false;
            showDeleteConfirmation.value = false
        }
    }
    async function refreshTasksList () {
        try {
            loading.value = true
            const response = await task.tasks();

            todos.value = response.tasks;
        } catch (error) {
            showNotifier('Failed to load todos')
            console.error(error)
        } finally {
            loading.value = false
        }
    }

    function shouldLoad (item, action) {
        const isSame = item.id === todo.value?.id
        const isLoading = todo.value?.loading

        if (action === todo.value?.action) return isSame && isLoading;

        return false;
    }

    function showNotifier (message) {
        notificationText.value = message
        showNotification.value = true
    }

    refreshTasksList()

    definePageMeta({
        middleware: [
            'auth'
        ]
    })

    useHead({
        title: 'Todo List | Dashboard',
    })
</script>

<template>
    <div class="h-full !flex items-center justify-center">
        <div class="w-[50%] min-h-[50%]">
            <div class="flex">
                <v-btn
                    class="ml-auto"
                    @click="logout"
                >
                    Logout
                </v-btn>
            </div>
        <v-card
            elevated
            class="w-full h-auto mt-5"
        >
            <v-overlay v-model="loading" persistent class="flex items-center justify-center">
                <v-progress-circular
                    indeterminate
                    color="primary"
                    size="64"
                />
            </v-overlay>


            <v-card-title class="!flex !justify-end gap-3 bg-gray-100 pa-4">
                <v-chip
                    variant="elevated"
                    size="small"
                    color="#D3D3D3"
                >
                    Todos
                    <v-badge
                        color="white"
                        :content="todos.length"
                        inline
                        class="mr-[-10px]"
                    />
                </v-chip>

                <v-chip
                    variant="elevated"
                    size="small"
                    color="#5865f2"
                >
                    Open
                    <v-badge
                        color="white"
                        :content="openTodosCount"
                        inline
                        class="mr-[-10px]"
                    />
                </v-chip>

                <v-chip
                    variant="elevated"
                    size="small"
                    color="#12B488"
                >
                    Done
                    <v-badge
                        color="white"
                        :content="doneTodosCount"
                        inline
                        class="mr-[-10px]"
                    />
                </v-chip>

                <v-btn
                    v-if="doneTodosCount"
                    size="small"
                    prepend-icon="mdi-trash-can"
                    color="red"
                    rounded="xs"
                    @click="bulkDeleteTasks(true)"
                >
                    Remove Done Tasks
                </v-btn>

                <v-btn
                    size="small"
                    prepend-icon="mdi-trash-can"
                    rounded="xs"
                    color="red"
                    @click="bulkDeleteTasks()"
                >
                    Remove Tasks
                </v-btn>
            </v-card-title>

            <v-card-item>
                <div class="flex h-[50px]">
                    <h2 class="font-bold text-lg text-gray-500">Todo List</h2>

                    <div class="ml-auto flex">
                        <v-switch
                            v-model="showActiveOnly"
                            label="Show Done Only"
                            color="primary"
                            class="mt-[-10px]"
                        />

                        <v-btn
                            prepend-icon="mdi-refresh"
                            class="ml-5"
                            @click="refreshTasksList"
                        >
                            Refresh
                        </v-btn>
                    </div>
                </div>

                <div>
                    <div
                        v-if="!filteredTodos.length"
                        class="min-h-[300px] flex items-center justify-center text-gray-500"
                    >
                        No todos to display
                    </div>

                    <v-virtual-scroll
                        v-else
                        :height="300"
                        :items="filteredTodos"
                    >
                        <template v-slot:default="{ item }">
                            <v-hover>
                                <template v-slot:default="{ isHovering, props }">
                                    <v-card
                                        v-bind="props"
                                        variant="outlined"
                                        class="my-2"
                                        :class="{
                                            'status-done': item.status === DONE,
                                            'status-active': item.status === ACTIVE
                                        }"
                                        :elevation="isHovering ? 5 : 2"
                                    >
                                        <v-card-item class="!py-1">
                                            <div class="flex items-center">
                                                <div class="font-gray-500 todo-title w-full">
                                                    {{ item.title }}
                                                </div>

                                                <v-spacer />

                                                <div class="flex">
                                                    <v-btn
                                                        icon="mdi-check-circle"
                                                        size="small"
                                                        variant="text"
                                                        :color="item.status === DONE ? '#D3D3D3' : '#12B488'"
                                                        :loading="shouldLoad(item, 'updating-status')"
                                                        @click="updateTodoStatus(item, item.status === DONE ? ACTIVE : DONE)"
                                                    />

                                                    <v-btn
                                                        icon="mdi-trash-can"
                                                        size="small"
                                                        variant="text"
                                                        color="red"
                                                        :loading="shouldLoad(item, 'deleting')"
                                                        @click="removeTodo(item)"
                                                    />
                                                </div>
                                            </div>
                                        </v-card-item>
                                    </v-card>
                                </template>
                            </v-hover>
                        </template>
                    </v-virtual-scroll>
                </div>
            </v-card-item>

            <v-card-actions class="bg-gray-100">
                <div class="flex w-full">
                    <v-text-field
                        ref="titleRef"
                        v-model="title"
                        :rules="titleRules"
                        density="comfortable"
                        variant="outlined"
                        label="Tasks Title"
                        hint="Press enter to save task"
                        clearable
                        @keydown.enter="handleSave"
                    />

                    <v-btn
                        icon="mdi-content-save"
                        variant="text"
                        color="primary"
                        @click="handleSave"
                    />
                </div>
            </v-card-actions>
        </v-card>
        </div>

        <v-dialog
            v-model="showDeleteConfirmation"
            max-width="400"
            persistent
        >
            <v-card
                prepend-icon="mdi-trash-can"
                text="Are you sure you want to delete this todo?"
                title="Delete Todo"
            >
                <template v-slot:actions>
                    <v-spacer></v-spacer>

                    <v-btn @click="closeDeleteDialog">
                        Cancel
                    </v-btn>

                    <v-btn
                        color="red"
                        @click="deleteTodo"
                    >
                        Delete
                    </v-btn>
                </template>
            </v-card>
        </v-dialog>

        <v-dialog
            v-model="showBulkDeleteConfirmation"
            max-width="400"
            persistent
        >
            <v-card
                prepend-icon="mdi-trash-can"
                text="Are you sure you want to delete these todos?"
                title="Delete Todos"
            >
                <template v-slot:actions>
                    <v-spacer></v-spacer>

                    <v-btn @click="closeBulkDeleteDialog">
                        Cancel
                    </v-btn>

                    <v-btn
                        color="red"
                        @click="confirmBulkDeleteTasks"
                    >
                        Delete
                    </v-btn>
                </template>
            </v-card>
        </v-dialog>

        <v-snackbar
            v-model="showNotification"
            :timeout="5000"
            color="primary"
        >
            {{ notificationText }}

            <template v-slot:actions>
                <v-btn
                    variant="text"
                    @click="showNotification = false"
                >
                    Close
                </v-btn>
            </template>
        </v-snackbar>
    </div>
</template>

<style scoped>
    .status-done {
        border-color: #D3D3D3;;
    }

    .status-done .todo-title {
        color: #D3D3D3;
        text-decoration: line-through;
    }

    .status-active {
    }
</style>
