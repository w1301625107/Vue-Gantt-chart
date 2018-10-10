import 'es6-promise/auto' //兼容ie11
import Vue from 'vue'
import App from './App'
import store from './store/index.js'
import '../scss/index.scss'


if (!process.env.__DEV__) {
  Vue.config.debug = false;
  Vue.config.devtools = false;
  Vue.config.productionTip = false;
}


/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: {
    App
  },
  store,
  template: '<App/>'
})