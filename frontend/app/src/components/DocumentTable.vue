<template>
    <v-simple-table>
    <template v-slot:default>
        <thead>
        <tr>
            <th width="5%" class="text-left">
            
            </th>
            <th class="text-left">
            Name
            </th>
            <th class="text-left">
            Author
            </th>
            <th class="text-left">
            Modfied
            </th>
            <th class="text-left">
            
            </th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="item in documents"
            :key="item.text"
        > 
            <td><v-icon v-text="item.icon" :color="item.color"></v-icon></td>
            <td>{{ item.title }}</td>
            <td>{{ item.author }}</td>
            <td>{{ item.timestamp }}</td>
            <td>
                <v-menu
                    left
                    bottom
                >
                    <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        icon
                        v-bind="attrs"
                        v-on="on"
                    >
                        <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                    </template>

                    <v-list>
                    <v-list-item
                        v-for="n in 5"
                        :key="n"
                        @click="() => {}"
                    >
                        <v-list-item-title>Option {{ n }}</v-list-item-title>
                    </v-list-item>
                    </v-list>
                </v-menu>
            </td>
        </tr>
        </tbody>
    </template>
    </v-simple-table>
</template>
<script>
export default {
    data: () => ({
        documents: []
    }),
    created() {
        this.fetchFiles()
    },
    methods: {
        fetchFiles() {
            this.$gapi.getGapiClient().then((gapi) => {
                
                gapi.client.drive.files.list({
                    q: "mimeType='application/vnd.google-apps.document' or mimeType='application/vnd.openxmlformats-officedocument.wordprocessingml.document'",
                    'pageSize': 10,
                    'fields': "nextPageToken, files(id, name, mimeType, modifiedTime, ownedByMe, owners)"
                }).then((response) => {
                    this.documents = response.result.files.map(this.jsonifyFileInfo);
                    window.files = response.result.files
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
    },
}
</script>