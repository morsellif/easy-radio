export default defineNuxtConfig({
	modules: ['@vueuse/nuxt', '@nuxt/devtools'],
	build: {},
	nitro: {
		preset: 'vercel-edge',
	},
	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {},
			...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {}),
		},
	},
	/* i18n: {
		experimental: {
			jsTsFormatResource: true,
		},
		precompile: {
			strictMessage: false,
			escapeHtml: true,
		},
		debug: false,
		detectBrowserLanguage: {
			useCookie: true,
		},
		locales: ['en', 'it'],
		strategy: 'no_prefix',
		defaultLocale: 'en',
	}, */
	typescript: {},
	css: ['~/assets/css/main.css'],
	srcDir: './src/',
	app: {
		head: {
			title: 'easyRadio',
			meta: [
				{
					name: 'description',
					content:
						'Listen to the best italians webradios, all in one simple app.',
				},
				{
					name: 'keywords',
					content:
						'listen, italians, webradio, easy, web app, radio, radio italiane, italiano, radio web',
				},
				{
					name: 'viewport',
					content: 'width=device-width, initial-scale=1.0, viewport-fit=cover',
				},
				{
					name: 'mobile-web-app-capable',
					content: 'yes',
				},
				{ name: 'apple-mobile-web-app-capable', content: 'yes' },
				{ name: 'apple-mobile-web-app-title', content: 'easyRadio' },
				{ name: 'apple-mobile-web-app-status-bar-style', content: 'white' },
				{
					name: 'theme-color',
					media: '(prefers-color-scheme: light)',
					content: '#ffffff',
				},
				{
					name: 'theme-color',
					media: '(prefers-color-scheme: dark)',
					content: '#000000',
				},
			],
			link: [
				{ rel: 'manifest', href: 'manifest.json' },
				{ rel: 'mask-icon', href: 'safari-pinned-tab.svg', color: '#f8491b' },
				{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
				{
					rel: 'icon',
					type: 'image/png',
					sizes: '16x16',
					href: '/favicon-16x16.png',
				},
				{
					rel: 'icon',
					type: 'image/png',
					sizes: '32x32',
					href: '/favicon-32x32.png',
				},
				{
					rel: 'apple-touch-icon',
					type: 'image/png',
					sizes: '180x180',
					href: '/apple-touch-icon.png',
				},
				{
					rel: 'icon',
					type: 'image/png',
					sizes: '192x192',
					href: '/android-chrome-192x192.png',
				},
				{
					rel: 'icon',
					type: 'image/png',
					sizes: '512x512',
					href: '/android-chrome-512x512.png',
				},
			],
		},
	},
	ssr: true,
});
