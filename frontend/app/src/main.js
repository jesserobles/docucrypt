import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import moment from 'moment'
import VueGapi from 'vue-gapi'
import browser from 'diffie-hellman'

Vue.use(VueGapi, {
  apiKey: process.env.VUE_APP_API_KEY,
  clientId: process.env.VUE_APP_CLIENT_ID,
  discoveryDocs: ["https://docs.googleapis.com/$discovery/rest?version=v1", 
                  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
  scope: "https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/drive.file"
})
// email notification may be possible...
// https://stackoverflow.com/questions/64434577/node-js-drive-api-setting-emailmessage-when-creating-a-permission-does-not-send
// https://developers.google.com/drive/api/v3/reference/permissions/create#auth

Vue.config.productionTip = false
Vue.prototype.$appName = 'DocuCrypt'
Vue.prototype.moment = moment
Vue.prototype.dh = browser
new Vue({
  data: {
    authenticated: true,
    documents: [],
  },
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
