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
            @updateDocs="updateDocs"
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
  },
  methods: {
    newDoc() {
      this.$gapi.getGapiClient().then((gapi) => {
        gapi.client.docs.documents.create().then(respose => {
          let documentId = respose.result.documentId
          let title = respose.result.title
          this.$router.push({ name: 'Document', params: {id: documentId, title: title}})
        })
      }).then(this.updateDocs)
    },
    updateDocs() {
      console.log("Home.updateDocs")
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
  }),
}
</script>
