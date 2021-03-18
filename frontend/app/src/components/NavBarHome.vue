<template>
    <v-app-bar app>
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
    </v-app-bar>
</template>
<script>
export default {
    props: {
        isSignedIn: {
            type: Boolean,
            default: false,
        },
        userName: {
            type: String
        }
    },
    data: () => ({ drawer: false }),
    computed: {
        sign() {
            if (this.isSignedIn) {
                return 'Logout'
            }
            return 'Login'
        },
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
        logfunction() {
            if (this.isSignedIn) {
                this.logout()
                return
            }
            this.login()
            return
        },
    },
}
</script>