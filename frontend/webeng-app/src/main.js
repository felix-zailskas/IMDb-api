import Vue from 'vue'
import App from './App.vue'
// import Axios from 'axios'
const axios = require('axios')
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
// import './custom.scss'

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

// Axios.defaults.baseURL = 'http://localhost:3000/api/'

Vue.prototype.$http = axios
Vue.prototype.$baseURL = 'http://localhost:3000/api/'
Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
