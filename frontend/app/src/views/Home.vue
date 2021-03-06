<template>
<div>
  <v-navigation-drawer
    v-model="drawer"
    app
    temporary
  >
    <NavigationDrawer/>
  </v-navigation-drawer>
  <NavBarHome
    v-on:toggledrawer="toggle"
    v-on:login="login"
    v-on:logout="logout"
    :isSignedIn="isSignedIn"
    :userName="userName"
  />
  <div>
    <v-row>
      <v-col>
        <v-sheet
          min-height="40vh"
          rounded="lg"
          class="grey lighten-2"
        >
          <v-container>
            <v-row
              align="center"
              justify="center"
            >
              <v-col
                class="mt-2"
                cols="12"
              >
                <v-row
                  align="center"
                  justify="center"
                >
                  <strong>Create a new document</strong>
                </v-row>
              </v-col>

              <v-col
                cols="6"
                md="2"
              >
                <v-hover
                  v-slot="{ hover }"
                >
                  <v-card
                    height="185"
                    width="146"
                    rounded
                    :elevation="hover ? 12 : 2"
                    
                    @click="newDoc"
                  >
                  <!-- :to="'/doc'" -->
                    <v-container fill-height fluid>
                      <v-row
                        align="center"
                        justify="center"
                      >
                        <v-icon
                          x-large
                          color="blue darken-2"
                        >mdi-plus-thick</v-icon>
                      </v-row>
                    </v-container>
                  </v-card>
                </v-hover>
              </v-col>
            </v-row>
          </v-container>
        </v-sheet>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-container>
          <DocumentTable 
            :documents="documents"
            :userId="userId"
            @updateDocs="updateDocs"
            @toggleOverlay="toggleOverlay"
          />
        </v-container>
      </v-col>
    </v-row>
  </div>
</div>
</template>

<script>
// @ is an alias to /src
import NavigationDrawer from '@/components/NavigationDrawer'
import DocumentTable from '@/components/DocumentTable.vue'
import NavBarHome from '@/components/NavBarHome.vue'
import CryptoJS from 'crypto-js'
export default {
  props: {
    documents: Array,
    isSignedIn: Boolean,
    userName: String,
  },
  components: {
    DocumentTable,
    NavigationDrawer,
    NavBarHome,
  },
  name: 'Home',
  created() {
    this.loggedIn = this.$root.authenticated
    if (this.loggedIn) {
      let user = this.$gapi.getUserData()
      if (user)
        this.userId = user.id
    }
  },
  methods: {
    getStorageKey(docId) {
      return `DC_${this.userId}_${docId}`
    },
    encryptText(rawText, key) {
      let encrypted = CryptoJS.AES.encrypt(rawText, key)
      return encrypted.toString()
    },
    toggleOverlay(val) {
      this.$emit("toggleOverlay", val)
    },
    newDoc() {
      this.$emit("toggleOverlay", true)
      if (!this.$root.authenticated) {
        this.$emit("toggleOverlay", false)
        return
      }
      let user = this.$gapi.getUserData()
      this.userId = user.id
      this.$gapi.getGapiClient().then((gapi) => {
        this.$emit("toggleOverlay", true)
        // We need to generate the DH object to create a document
        // We can add the metadata to the document, encrypt the text
        const dhObject = this.dh.createDiffieHellman(128)
        const prime = dhObject.getPrime('hex').toString('hex')
        const publicKeyObj = dhObject.generateKeys().toString('hex');
        const privateKey = dhObject.getPrivateKey('hex')
        let documentLocalData = {
          "privateKey": privateKey,
          "prime": prime,
          "authorPublicKey": publicKeyObj
        }
        let appProperties = {authorPublicKey: publicKeyObj, encryptionKeyName: 'author'}
        gapi.client.docs.documents.create().then(response => {
          let requests = [
              {
                  'insertText': {
                      'location': {
                          'index': 1,
                      },
                      'text': this.encryptText('\n', privateKey)
                  }
              }
          ]
          let documentId = response.result.documentId
          let title = response.result.title
          let storageKey = `_DC_${this.userId}_${documentId}`
          localStorage.setItem(storageKey, JSON.stringify(documentLocalData))
          gapi.client.docs.documents.batchUpdate(
                {documentId: documentId, requests: requests}
          ).then(() => {
            gapi.client.drive.files.update(
              {fileId: documentId, appProperties: appProperties}
            ).then(() => {
              this.$emit("toggleOverlay", false)
              this.updateDocs()
              this.$router.push({ name: 'Document', params: {id: documentId, title: title}})
            })
          })
        })
      }).catch(() => {
        this.$emit("toggleOverlay", false)
      })
    },
    updateDocs() {
      this.$emit("updateDocs")
    },
    cardAction() {
      alert("clicked")
    },
    login() {
        this.$emit('login');
    },
    logout() {
        this.$emit('logout');
    },
    toggle() {
      this.drawer = !(this.drawer)
    },
  },
  data: () => ({
    loggedIn: false,
    drawer: false,
    dialog: false,
    userId: null,
  }),
}
</script>
