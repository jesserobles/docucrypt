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