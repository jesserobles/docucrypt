<template>
<div>
    <NavBar
      :isSignedIn="isSignedIn"
      :userName="userName"
      :title="title"
      @save="save"
      @updateTitle="updateTitle"
    /> 
    <div class="wrapper">
        <Editor 
            :documentId="documentId"
            @title="refreshTitle"
            @toggleOverlay="toggleOverlay"
            ref="editor"
        />
    </div>
</div>


</template>
<script>
import Editor from '@/components/Editor.vue'
import NavBar from '@/components/NavBar.vue'
export default {
   components: {
        Editor,
        NavBar,
   },
   props: {
       isSignedIn: Boolean,
       userName: String,
   },
   data() {
       return {
           documentId: this.$route.params.id,
           document: {},
           title: ''
       }
   },
   created() {
       this.title = this.$route.params.title
       document.onkeydown = this.overridesave
   },
    methods: {
        save() {
            // Add custom file properties to indicate if file is encrypted:
            // https://developers.google.com/drive/api/v3/properties
            this.$refs.editor.save()
        },
        overridesave(e) {
            // Method to allow ctr+s and cmd+s to be used to save to docs
            if ((e.metaKey || e.ctrlKey) && (e.key === 's')) {
                e.preventDefault();
                this.save()
            }
        },
        refreshTitle(title) {
            this.title = title
        },
        toggleOverlay(show) {
            this.$emit("toggleOverlay", show)
        },
        updateTitle(e) {
            this.$gapi.getGapiClient().then((gapi) =>{
                gapi.client.drive.files.update({
                    fileId: this.documentId, 
                    resource: {'name': e}
                }).then(() => {
                    this.refreshTitle(e)
                    this.$emit("updateDocs")
                })
            })
        },
        fetchDocument() {
            this.$emit("toggleOverlay", true)
            this.$gapi.getGapiClient().then((gapi) => {
                gapi.client.docs.documents.get({
                    documentId: this.documentId
                }).then(response => {
                    this.document = response.result
                    this.$emit("toggleOverlay", false)
                })
            })
       }
   },
}

</script>