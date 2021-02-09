<template>
    <v-app-bar app>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
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
    </v-app-bar>
</template>
<script>
export default {
    data: () => ({ drawer: false }),
}
</script>