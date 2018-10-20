const pkg = require('./package')

module.exports = {
  mode: 'spa',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'author', content: 'morrah' },
      { name: 'keywords', content: 'ragnarok online steal calculator' },
      { hid: 'description', name: 'description', content: pkg.description },
      { name: 'msapplication-TileColor', content: '#ffffff' },
      { name: 'msapplication-TileImage', content: './ms-icon-144x144.png' },
      { name: 'theme-color', content: '#ffffff' }
    ],
    link: [
      { rel: 'apple-touch-icon', sizes: "57x57", href: './apple-icon-57x57.png' },
      { rel: 'apple-touch-icon', sizes: "60x60", href: './apple-icon-60x60.png' },
      { rel: 'apple-touch-icon', sizes: "72x72", href: './apple-icon-72x72.png' },
      { rel: 'apple-touch-icon', sizes: "76x76", href: './apple-icon-76x76.png' },
      { rel: 'apple-touch-icon', sizes: "114x114", href: './apple-icon-114x114.png' },
      { rel: 'apple-touch-icon', sizes: "120x120", href: './apple-icon-120x120.png' },
      { rel: 'apple-touch-icon', sizes: "144x144", href: './apple-icon-144x144.png' },
      { rel: 'apple-touch-icon', sizes: "152x152", href: './apple-icon-152x152.png' },
      { rel: 'apple-touch-icon', sizes: "180x180", href: './apple-icon-180x180.png' },
      { rel: 'icon', type: 'image/png', sizes: "192x192", href: './android-icon-192x192.png' },
      { rel: 'icon', type: 'image/png', sizes: "144x144", href: './android-icon-144x144.png' },
      { rel: 'icon', type: 'image/png', sizes: "96x96", href: './android-icon-96x96.png' },
      { rel: 'icon', type: 'image/png', sizes: "72x72", href: './android-icon-72x72.png' },
      { rel: 'icon', type: 'image/png', sizes: "48x48", href: './android-icon-48x48.png' },
      { rel: 'icon', type: 'image/png', sizes: "36x36", href: './android-icon-36x36.png' },
      { rel: 'icon', type: 'image/png', sizes: "96x96", href: './favicon-96x96.png' },
      { rel: 'icon', type: 'image/png', sizes: "32x32", href: './favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: "16x16", href: './favicon-16x16.png' },
      { rel: 'icon', type: 'image/x-icon', href: './favicon.ico' },
      { rel: 'manifest', href: './manifest.json' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [,
    // Doc: https://bootstrap-vue.js.org/docs/
    'bootstrap-vue/nuxt',
  ],
  router: {
    //base: process.env.NODE_ENV === 'dev' ? '/' : '/stealcalc/',
    base: '/'
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
   extend (config, { isDev, isClient }) {
      if (!isDev) {
        // relative links, please.
        config.output.publicPath = './_nuxt/'
      }
      return config;
    }
  }
}
