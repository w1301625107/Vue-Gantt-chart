import Vue from 'vue'
import App from './App'
import '../scss/index.scss'



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