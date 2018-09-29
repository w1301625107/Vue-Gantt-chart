import Vue from 'vue'
import App from './App'
import '../scss/index.scss'

//注册全局过滤器
import {
  dateFmt,
} from './filters/format.js'
Vue.filter('dateFmt', dateFmt);

Vue.config.devtools = true;
//Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: {
    App
  },
  template: '<App/>'
})