import Vue from "vue";
import VeeValidate, { Validator } from "vee-validate";
Vue.use(VeeValidate, {
  events: 'change|blur|input'
});