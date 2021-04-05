<template>
    <v-simple-table class="row-pointer">
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
            class="rounded-xl"
            v-for="item in documents"
            :key="item.text"
            @click="$router.push({ name: 'Document', params: {id: item.documentId, title: item.title}})"
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
                        v-for="opt in funcOptions"
                        :key="opt.name"
                        @click="opt.method(item.documentId)"
                    >
                        <v-list-item-title>{{ opt.name }}</v-list-item-title>
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
// import _ from 'lodash'
export default {
    props: {
        loggedIn: {
            type: Boolean,
            default: false
        },
        documents: Array

    },
    data: () => ({
        funcOptions: []
    }),

    created() {
        this.funcOptions = [   
            {"name": "Delete", "method": this.deleteDoc},
            {"name": "Share", "method": this.shareDoc}
        ]
    },
    methods: {
        shareDoc(docID) {
            console.log("share" + docID)
        },
        share(email, docID, primeNumber) {
            let baseUrl = window.location.origin
            let message = baseUrl + '/doc/' + docID + '?p=' + primeNumber
            this.$gapi.getGapiClient().then((gapi) => {
                gapi.client.drive.permissions.create({
                        fileId: docID,
                        emailMessage: message,
                        sendNotificationEmail: true,
                        type: 'user',
                        role: 'writer',
                        emailAddress: email,
                        fields: 'id',
                    }).execute()
            })
        },
        deleteDoc(docID) {
            this.$gapi.getGapiClient().then((gapi) => {
                gapi.client.drive.files.delete({fileId: docID}).execute()
            }).then(this.updateDocs)
        },
        updateDocs() {
            this.$emit("updateDocs")
        },
    },
}
</script>
<style lang="css" scoped>
.row-pointer >>> tbody tr :hover {
  cursor: pointer;
}
</style>