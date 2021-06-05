import Vue from 'vue'
import App from './App.vue'
import vuetify from '@/plugins/vuetify'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

// Styles: SCSS
import './styles/index.scss';

import Utils from "./utils";
import '@/plugins/axios.js';
import "@/plugins/flatDatePicker"
import "@/plugins/veeValidate";
import 'vue-search-select/dist/VueSearchSelect.css'
Vue.use(Utils);
new Vue({
  vuetify,
  render: h => h(App),
}).$mount('#app')
