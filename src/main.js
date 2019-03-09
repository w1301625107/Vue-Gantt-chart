import Vue from 'vue'
import App from './App.vue'
import vGanttChart from "./lib/v-gantt-chart"

Vue.config.productionTip = false
Vue.use(vGanttChart)

new Vue({
  render: h => h(App),
}).$mount('#app')
