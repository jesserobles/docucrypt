<template>
<div>
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <v-card>
        <v-card-title class="headline grey lighten-2">
          Share Document
        </v-card-title>
        <v-form
            ref="form"
            @submit.prevent="submit"
        >
        <v-card-text>
         <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="form.email"
                  label="Email*"
                  required
                  :rules="rules.email"
                ></v-text-field>
              </v-col>
            </v-row>
         </v-container>
        </v-card-text>
        </v-form>
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            :disabled="!formIsValid"
            text
            @click="shareDoc"
          >
            Share
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
    </div>
</template>
<script>
// import _ from 'lodash'
export default {
    props: {
        loggedIn: {
            type: Boolean,
            default: false
        },
        documents: Array,
        userId: String

    },
    data: () => {
        const defaultForm = Object.freeze({
            email: '',
        })
        return {
            form: Object.assign({}, defaultForm),
            funcOptions: [],
            dialog: false,
            rules: {
                email: [val => (((val || '').length > 0) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((val || ''))) || 'Email address is required']
            },
            currentDocId: null,
            defaultForm
        }
    },
    computed: {
      formIsValid () {
        return (
          this.form.email
        )
      },
    },
    created() {
        this.funcOptions = [   
            {"name": "Delete", "method": this.deleteDoc},
            {"name": "Share", "method": this.openShare}
        ]
        window.share = this.share
    },
    methods: {
        resetForm () {
            this.form = Object.assign({}, this.defaultForm)
            this.$refs.form.reset()
        },
        submit () {
            this.resetForm()
        },
        getStorageKey(docID) {
            return `_DC_${this.userId}_${docID}`
        },
        openShare(docID) {
            this.dialog = true
            this.currentDocId = docID
        },
        shareDoc() {
            let docID = this.currentDocId
            let email = this.form.email
            let storageKey = this.getStorageKey(docID)
            let documentLocalData = localStorage.getItem(storageKey)
            if (!documentLocalData)
                return
            documentLocalData = JSON.parse(documentLocalData)
            const prime = documentLocalData.prime
            const urlWithParams = new URL(`${window.location.href}doc/${docID}`)
            urlWithParams.searchParams.append("p", prime)
            let message = {
                fileId: docID,
                emailMessage: urlWithParams.href,
                sendNotificationEmail: true,
                type: 'user',
                role: 'writer',
                emailAddress: email,
                
            }
            this.$gapi.getGapiClient().then((gapi) => {
                gapi.client.drive.permissions.create(message).then(() => {
                    this.dialog = false
                    this.resetForm()
                })
            })
        },
        toggleOverlay(show) {
            console.log("DocumentTable.toggleOverlay: " + show)
            this.$emit("toggleOverlay", show)
        },
        deleteDoc(docID) {
            this.toggleOverlay(true)
            this.$gapi.getGapiClient().then((gapi) => {
                gapi.client.drive.files.delete({fileId: docID}).then(this.updateDocs)
            }).then(() => {
                // delete key
                let key = this.getStorageKey(docID)
                localStorage.removeItem(key)
                this.updateDocs()
            })
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