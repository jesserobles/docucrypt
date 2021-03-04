<template>
  <v-app id="inspire">
    <v-navigation-drawer
            v-model="drawer"
            app
            temporary
        >
      <NavigationDrawer/>
    </v-navigation-drawer>
    <NavBar 
      :editor="editor"
      v-on:toggledrawer="toggle"
      v-on:login="login"
      v-on:logout="logout"
      :isSignedIn="isSignedIn"
      :userName="userName"
    />
    <v-main>
    <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
  import NavigationDrawer from './components/NavigationDrawer'
  // import NavBarHome from './components/NavBarHome'
  import NavBar from './components/NavBar'
  export default {
    watch:{
        $route (){
            this.switchNavBar();
        }
    },
    title: 'Hi there',
    components: {
      NavigationDrawer,
      // NavBarHome,
      NavBar

    },
    name: 'App',
    data: () => ({ 
      drawer: false,
      editor: false,
      isSignedIn: false,
      userName: null
    }),
    created() {
      document.title = this.$appName; // better way to dynamically handle title @ https://stackoverflow.com/questions/36612847/how-can-i-bind-the-html-title-content-in-vuejs
      window.app = this
      this.$gapi.getAuthInstance().then(response => {
        this.isSignedIn = response.isSignedIn.get()
        if (this.isSignedIn) {
          this.userName = this.$gapi.getUserData().firstName
        }
      })
    },
    computed: {
      LoggedIn() {
        return this.$gapi.getUserData()
      }
    },
    methods: {
      switchNavBar() {
        if (this.$route.name === 'Document') {
          this.editor = true
        } else {
          this.editor = false
        }
      },
      toggle() {
        this.drawer = !(this.drawer)
      },
      login() {
        this.$gapi.login().then(() => {
          this.isSignedIn = true
          this.userName = this.$gapi.getUserData().firstName
        })
        
      },
      logout() {
        this.$gapi.logout().then(() => {
          this.isSignedIn = false
          this.userName = null
        })
        
      },
    }
  }
</script>