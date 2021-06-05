import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';


Vue.use(VueAxios, axios);

/* Integrating Axios */
axios.defaults.baseURL = process.env.VUE_APP_API_LIVE_HOST + '/api/';

axios.defaults.baseURL = "http://localhost:5000" + '/api/';