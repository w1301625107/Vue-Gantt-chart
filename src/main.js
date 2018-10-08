import 'es6-promise/auto' //兼容ie11
import Vue from 'vue'
import App from './App'
import store from './store/index.js'
import '../scss/index.scss'



Vue.config.devtools = true;
//Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: {
    App
  },
  store,
  template: '<App/>'
})