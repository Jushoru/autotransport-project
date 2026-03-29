export default defineNuxtConfig({
    app: {
        baseURL: '/',
        head: {
            title: 'Очереди автотранспорта',
            htmlAttrs: { lang: 'ru', dir: 'ltr' },
            link: [
                { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg', sizes: 'any' },
                { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
            ],
        },
    },
    compatibilityDate: '2025-07-15',
    devtools: { enabled: false },
    css: ['~/assets/css/main.scss'],
    modules: [
        '@nuxt/image',
        '@pinia/nuxt',
        'nuxt-headlessui'
    ],
    typescript: { typeCheck: 'build' },
    image: {
        format: ['avif', 'webp', 'png']
    }
})