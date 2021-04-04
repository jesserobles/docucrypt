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
    },
    data() {
        return {
            elements: [],
            tagMap: {
                italic: "em",
                underline: "u",
                bold: "strong",
            },
            html: "",
        }
    },
    created() {
        this.paragraph.elements.forEach(elem => {
            this.elements.push(elem)
        })
        this.html = this.jsonToHtml(this.paragraph)
    },
    methods: {
        changed(element) {
            this.$emit('changed', element)
        },
        jsonToHtml(paragraph) {
            // This will generate the inner html that goes into a
            // paragraph element.
            let content = ""
            let elements = paragraph['elements']
            for (let i = 0;i < elements.length; i++) {
                let innerHtml = elements[i].textRun.content;
                let textStyle = elements[i].textRun.textStyle
                if (textStyle && 
                    Object.keys(textStyle).length !== 0 && 
                    textStyle.constructor === Object) {
                    for (const [key, value] of Object.entries(
                        elements[i].textRun.textStyle
                    )) {
                        if (value) {
                            let e = document.createElement(this.tagMap[key])
                            e.innerHTML = innerHtml
                            innerHtml = e.outerHTML
                            content += innerHtml
                        }
                    }
                } else { // just a plain text run
                    content += innerHtml
                }
            }
            return content
        },
        htmlToJson(html) {
            return html
        },
    },
}
</script>