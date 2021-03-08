<template>
    <p>
        <Element v-for="(elem, index) in elements" 
            :key="index"
            :element=elem
            :documentId="documentId"
            @changed="changed"
        />
    </p>
</template>
<script>
import Element from '@/components/Element.vue'
export default {
    components: {
        Element
    },
    props: {
        paragraph: Object,
        documentId: String,
    //     'paragraph': {'elements': [{'startIndex': 1,
    //     'endIndex': 27,
    //     'textRun': {'content': 'Hello from Docucrypt! Hi. ', 'textStyle': {}}},
    //     {'startIndex': 27,
    //     'endIndex': 31,
    //     'textRun': {'content': 'Some', 'textStyle': {'italic': True}}},
    //     {'startIndex': 31,
    //     'endIndex': 32,
    //     'textRun': {'content': ' ', 'textStyle': {}}},
    //     {'startIndex': 32,
    //     'endIndex': 41,
    //     'textRun': {'content': 'formatted', 'textStyle': {'underline': True}}},
    //     {'startIndex': 41,
    //     'endIndex': 42,
    //     'textRun': {'content': ' ', 'textStyle': {}}},
    //     {'startIndex': 42,
    //     'endIndex': 46,
    //     'textRun': {'content': 'text', 'textStyle': {'bold': True}}},
    //     {'startIndex': 46,
    //     'endIndex': 48,
    //     'textRun': {'content': '.\n', 'textStyle': {}}}],
    // 'paragraphStyle': {'namedStyleType': 'NORMAL_TEXT',
    //     'direction': 'LEFT_TO_RIGHT'}}},

    },
    data() {
        return {
            elements: []
        }
    },
    created() {
        this.paragraph.elements.forEach(elem => {
            this.elements.push(elem)
        })
    },
    methods: {
        changed(element) {
            this.$emit('changed', element)
        }
    },
}
</script>