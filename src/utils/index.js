"use strict";

import events from "./events";
import moment from 'moment-timezone';
export default {
  install(Vue) {
    //events bus
    Vue.prototype.$events = events;
    Vue.prototype.$moment = moment;
        // if toParse is date object and has a timezone it will be set to that timezone
    // else it will use the local timezone
    Vue.prototype.$momentLocal = function (toParse) {
      let parse = toParse;
      if (toParse === "now") {
        let now = new Date();
        parse = now.getTime();
      }
      return moment.tz(parse, moment.tz.guess(true));
    };
  }
};
