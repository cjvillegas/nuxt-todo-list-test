/**
 * auth user route guard
 */
export default defineNuxtRouteMiddleware((to, from) => {
    const authed = useState('authenticated').value

    if (!authed) {
        return navigateTo('/login')
    }
})
