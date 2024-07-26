<script setup>
    import auth from '~/services/api/auth.js';

    // composables
    const { emailRule, passwordRule } = useFieldValidators();

    // data
    const showLoginFailNotif = ref(false)
    const passwordShowing = ref(false)
    const loading = ref(false)
    const form = ref({
        username: null,
        password: null
    })

    async function login () {
        try {
            loading.value = true
            const data = await auth.login(form.value.username, form.value.password);

            // navigate to the home screen on successful login
            useRouter().push({ path: '/' })
        } catch (error) {
            showLoginFailNotif.value = true
            console.error(error)
        } finally {
            loading.value = false
        }
    }

    useHead({
        title: 'Todo List | Login',
    })
</script>

<template>
    <div class="h-full !flex items-center justify-center">
        <v-card
            elevated
            class="w-[30%] pa-2"
        >
            <v-card-title class="text-center">
                Login
            </v-card-title>
            <v-card-item>
                <v-form @submit.prevent="login">
                    <v-text-field
                        v-model="form.username"
                        :disabled="loading"
                        :rules="emailRule"
                        prepend-inner-icon="mdi-email-outline"
                        density="comfortable"
                        label="Email"
                        clearable
                    />

                    <v-text-field
                        v-model="form.password"
                        prepend-inner-icon="mdi-lock-outline"
                        :append-inner-icon="passwordShowing ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="passwordShowing ? 'text' : 'password'"
                        :rules="passwordRule"
                        density="comfortable"
                        label="Password"
                        :disabled="loading"
                        clearable
                        class="mt-5"
                        @click:append-inner="passwordShowing = !passwordShowing"
                    />

                    <v-btn
                        type="submit"
                        variant="elevated"
                        rounded="xs"
                        color="#5865f2"
                        :loading="loading"
                        block
                        class="mt-5"
                    >
                        Submit
                    </v-btn>
                </v-form>
            </v-card-item>
        </v-card>

        <v-snackbar
            v-model="showLoginFailNotif"
            :timeout="5000"
            color="red"
        >
            Invalid username or password. Please try again.

            <template v-slot:actions>
                <v-btn
                    variant="text"
                    @click="showLoginFailNotif = false"
                >
                    Close
                </v-btn>
            </template>
        </v-snackbar>
    </div>
</template>
