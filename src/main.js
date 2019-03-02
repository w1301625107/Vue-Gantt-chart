import Vue from 'vue'
import App from './App'
import store from './store/index.js'
import '../scss/index.scss'

Vue.config.debug = __DEV__;
Vue.config.devtools = __DEV__;
Vue.config.productionTip = __DEV__;


/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: {
    App
  },
  store,
  template: '<App/>'
})