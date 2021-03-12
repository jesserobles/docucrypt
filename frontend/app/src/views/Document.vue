<template>
<div>
    <NavBar
      :isSignedIn="isSignedIn"
      :userName="userName"
      :title="title"
    /> 
    <div class="wrapper">
        <Editor 
            :documentId="documentId"
            @title="refreshTitle"
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
   },
    methods: {
        refreshTitle(title) {
            this.title = title
        },
        fetchDocument() {
            this.$gapi.getGapiClient().then((gapi) => {
                gapi.client.docs.documents.get({
                    documentId: this.documentId
                }).then(response => {
                    this.document = response.result
                })
            })
       }
   },
}

</script>