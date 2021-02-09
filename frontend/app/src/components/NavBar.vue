<template>
    <v-app-bar app>
        <template  v-if="!editor">
            <!-- <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon> -->
            <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>
            <v-toolbar-title>{{this.$appName}}</v-toolbar-title>
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
        </template>
    </v-app-bar>
</template>
<script>
export default {
    props: {
        editor: {
            type: Boolean,
            default: false,
        }
    },
    data: () => ({ drawer: false }),
    methods: {
        toggleDrawer() {
            this.$emit('toggledrawer');
            // console.log("clicked icon")
        }
    },
}
</script>