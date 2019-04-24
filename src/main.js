import Vue from 'vue'
import App from './App.vue'
import vGanttChart from './lib/v-gantt-chart/index'
// import vGanttChart from "v-gantt-chart"
import { Popover } from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false
Vue.use(vGanttChart)
Vue.use(Popover)

new Vue({
  render: h => h(App)
}).$mount('#app')
