<template>
  <v-app id="inspire">
    <v-overlay :value="overlay">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
    <v-main>
    <router-view
      :documents="documents"
      :isSignedIn="isSignedIn"
      :userName="userName"
      @login="login"
      @logout="logout"
      @toggleOverlay="toggleOverlay"
      @updateDocs="fetchFiles"
    ></router-view>
    </v-main>
  </v-app>
</template>

<script>
  export default {
    title: 'Hi there',
    components: {
    },
    name: 'App',
    data: () => ({ 
      drawer: false,
      editor: false,
      isSignedIn: false,
      userName: null,
      documents: [],
      overlay: false,
    }),
    created() {
      window.dh = this.dh
      this.overlay = true
      window.fetchFiles = this.fetchFiles
      document.title = this.$appName; // better way to dynamically handle title @ https://stackoverflow.com/questions/36612847/how-can-i-bind-the-html-title-content-in-vuejs
      this.$gapi.getAuthInstance().then(response => {
        this.isSignedIn = response.isSignedIn.get()
        this.$root.authenticated = this.isSignedIn
        if (this.isSignedIn) {
          this.userName = this.$gapi.getUserData().firstName
          if (this.documents.length == 0) {
            this.fetchFiles()
            this.overlay = false
          }
        }
      })
    },
    computed: {
      LoggedIn() {
        return this.$gapi.getUserData()
      }
    },
    methods: {
      getSender() {
        let docucrypt_id = localStorage.getItem("DOCUCRYPT_ID")
        if (docucrypt_id == undefined || docucrypt_id == null) {
          docucrypt_id = 1
          localStorage.setItem("DOCUCRYPT_ID", docucrypt_id)
        }
        return docucrypt_id
      },
      switchNavBar() {
        if (this.$route.name === 'Document') {
          this.editor = true
        } else {
          this.editor = false
        }
      },
      toggleOverlay(show) {
        this.overlay = show
      },
      login() {
        this.$gapi.login().then(() => {
          this.isSignedIn = true
          this.userName = this.$gapi.getUserData().firstName
          this.$root.authenticated = true
          this.fetchFiles()
        })
        
      },
      logout() {
        this.$gapi.logout().then(() => {
          this.isSignedIn = false
          this.userName = null
          this.$root.authenticated = false
          this.documents = []
        })
      },
      fetchFiles() {
        this.toggleOverlay(true)
        console.log("App.fetchFiles")
        this.$gapi.getGapiClient().then((gapi) => {
          gapi.client.drive.files.list({
            q: "trashed=false and (mimeType='application/vnd.google-apps.document')",
            'pageSize': 10,
            'fields': "nextPageToken, files(id, name, mimeType, modifiedTime, ownedByMe, owners, appProperties)"
          }).then((response) => {
            let docs = response.result.files.map(this.jsonifyFileInfo)
            this.documents = docs
          }).then(() => {
            this.toggleOverlay(false)
          })
        })
      },
      jsonifyFileInfo(file) {
        return {
          title: file.name,
          icon: this.getIcon(file.mimeType),
          color: 'blue darken-2',
          timestamp: this.moment(file.modifiedTime).format('MMM D, YYYY'),
          author: this.getAuthor(file),
          documentId: file.id
        }
      },
      getIcon(mimeType) {
        return {
            'application/vnd.google-apps.document': 'mdi-file-document',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'mdi-file-word'
        }[mimeType]
      },
      getAuthor(file) {
        if (file.ownedByMe) return 'me'
        return file.owners[0].displayName
      }
    }
  }
</script>