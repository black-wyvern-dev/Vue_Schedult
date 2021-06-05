
import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css' // Ensure you are using css-loader
Vue.use(Vuetify)
const opts = {
    theme: {
      themes: {
        light: {
          primary: '#6481fe',
          secondary: '#192354',
          accent: '#8c9eff',
          error: '#b71c1c',
        },
      },
    },
    icons: {
        iconfont: 'mdi', // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
    },
  }

export default new Vuetify(opts)
