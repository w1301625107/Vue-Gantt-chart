import Vue from 'vue'
import App from './App'
import '../scss/index.scss'

Vue.config.debug = __DEV__;
Vue.config.devtools = __DEV__;
Vue.config.productionTip = __DEV__;


new Vue({
  el: '#app',
  components: {
    App
  },
  template: '<App/>'
})