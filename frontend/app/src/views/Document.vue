<template>
<div class="wrapper">
    <SimpleEditor />
</div>

</template>
<script>
import SimpleEditor from '@/components/SimpleEditor.vue'
export default {
   components: {
       SimpleEditor
   },
   data() {
       return {
           documentId: this.$route.params.id
       }
   },
   created() {
       console.log(this.documentId)
   },
}

</script>