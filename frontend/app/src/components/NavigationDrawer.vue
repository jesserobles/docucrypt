<template>
    <v-container>
        <v-list-item>
            <v-list-item-content>
            <v-list-item-title class="title">
                <v-list-item-icon>
                    <v-icon>mdi-lock</v-icon>
                </v-list-item-icon>
                {{ this.$appName }}
            </v-list-item-title>
            <v-list-item-subtitle>
                Privacy on Google Docs
            </v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list
            dense
            nav
        >
            <v-list-item
            v-for="item in apps"
            :key="item.title"
            link
            :to="item.link"
            >
            <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
            </v-list-item>
        </v-list>
        <v-divider></v-divider>

        <v-list
            dense
            nav
        >
            <v-list-item
            v-for="item in settingsItems"
            :key="item.title"
            link
            >
            <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-container>
</template>
<script>
export default {
    data () {
      return {
        apps: [
          { title: 'Docs', icon: 'mdi-file-document', link: '/'},
        //   { title: 'Sheets', icon: 'mdi-google-spreadsheet', link: '/'},
        //   { title: 'About', icon: 'mdi-help-box' },
        ],
        settingsItems: [
            {title: 'Settings', icon: 'mdi-cog-outline'},
            {title: 'Help', icon: 'mdi-help-circle-outline'}
        ],
        right: null,
      }
    },
}
</script>