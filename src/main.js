import Vue from 'vue'
import App from './App'
import '../scss/index.scss'
import vGanttChart from "@src/lib/v-gantt-chart/index.js";
// import gantt from 'v-gantt-chart'

const __DEV__= ENVIRONMENT === 'DEV' ? true :false;
Vue.config.debug = __DEV__;
Vue.config.devtools = __DEV__;
Vue.config.productionTip = __DEV__;

Vue.use(vGanttChart)


new Vue({
  el: '#app',
  components: {
    App
  },
  template: '<App/>'
})