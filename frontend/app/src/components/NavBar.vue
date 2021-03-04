<template>
    <v-app-bar app>
        <template  v-if="!editor">
            <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>
            <v-toolbar-title>
                <v-list-item-icon>
                    <v-icon>mdi-lock</v-icon>
                </v-list-item-icon>
                {{this.$appName}}
            </v-toolbar-title>
            <v-spacer></v-spacer>

            <v-responsive max-width="50%">
                <v-text-field
                dense
                flat
                hide-details
                solo-inverted
                prepend-inner-icon="mdi-magnify"
                ></v-text-field>
            </v-responsive>
            <v-spacer></v-spacer>
            <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn icon
                        v-bind="attrs"
                        v-on="on"
                    >
                        <v-avatar v-if="isSignedIn" color="grey lighten-2">
                            <span class="headline">{{ userName[0] }}</span>
                        </v-avatar>
                        <v-avatar v-else color="grey lighten-2">
                            <v-icon>mdi-account-circle</v-icon>
                        </v-avatar>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item
                        @click="logfunction"
                    >
                        <v-list-item-title>{{sign}}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </template>
        <!--https://github.com/motla/vue-file-toolbar-menu-->
        <template v-else>
            <EditorFileMenu />
        </template>
    </v-app-bar>
</template>
<script>
import EditorFileMenu from '@/components/EditorFileMenu.vue'
export default {
    components: {
        EditorFileMenu
    },
    props: {
        editor: {
            type: Boolean,
            default: false,
        },
        isSignedIn: {
            type: Boolean,
            default: false,
        },
        userName: {
            type: String
        }
    },
    data: () => ({ 
        drawer: false,
        items: [
            { title: 'Click Me1' },
            { title: 'Click Me2' },
            { title: 'Click Me3' },
            { title: 'Click Me4' },
        ],
    }),
    computed: {
      userAvatar() {
        if (this.isSignedIn) {
            return this.userName[0]
        }
        return '<v-avatar>mdi-account-circle</v-avatar>'
      },
      sign() {
          if (this.isSignedIn) {
              return 'Logout'
          }
          return 'Login'
      },
      logfunction() {
          if (this.isSignedIn) {
              return this.logout
          }
          return this.login
      }
    },
    methods: {
        toggleDrawer() {
            this.$emit('toggledrawer');
        },
        login() {
            this.$emit('login');
        },
        logout() {
            this.$emit('logout');
        },
    },
}
</script>