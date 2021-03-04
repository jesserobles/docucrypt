import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import moment from 'moment'
import VueGapi from 'vue-gapi'

Vue.use(VueGapi, {
  apiKey: 'AIzaSyCO2EY_VcadMkHoX4VZ0V1J3KvOPTAR8nM',
  clientId: '1095038343404-k7kn28lhvfc174j44s0mui4aioq74ni8.apps.googleusercontent.com',
  discoveryDocs: ["https://docs.googleapis.com/$discovery/rest?version=v1", 
                  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
  scope: "https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/drive.metadata.readonly"
})


Vue.config.productionTip = false
Vue.prototype.$appName = 'DocuCrypt'
Vue.prototype.moment = moment
new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
