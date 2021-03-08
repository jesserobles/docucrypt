<template>
    <span contenteditable="true"
        @input="changed"
        v-html="html"
    ></span>
</template>
<script>
import _ from 'lodash'
export default {
    props: {
        element: Object,
        documentId: String,
    //    [{'startIndex': 1,
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
    //     'textRun': {'content': '.\n', 'textStyle': {}}}]
    },
    data() {
        return {
            tagMap: {
                italic: "em",
                underline: "u",
                bold: "strong",
            },
            startIndex: null,
            endIndex: null,
            textRun: null,
            textStyle: {},
            content: '',
            html: '',
        }
    },
    created() {
        this.startIndex = this.element.startIndex
        this.endIndex = this.element.endIndex
        this.textRun = this.element.textRun
        this.textStyle = this.element.textRun.textStyle
        this.content = this.element.textRun.content
        this.html = this.renderElement(this.element)
    },
    methods: {
        changed(elem) {
            window.elemObj = this.element
            window.elem = elem
            let text = elem.srcElement.innerText
            console.log(text)
            this.debounceMethod()
        },
        deleteElement() {
            this.$gapi.getGapiClient().then((gapi) => {
                let requests = [
                    {
                        'deleteContentRange': {
                            'range': {
                                'startIndex': 1,
                                'endIndex': 6,
                            }
                        }
                    },
                ]
                gapi.client.docs.documents.batchUpdate(
                    {documentId: this.documentId, body: {'requests': requests}}).execute()
            })
        },
        debounceMethod: _.debounce(() => {
            console.log('Debounce button clicked!')
        }, 2000),
        renderElement(textrun) {
            let span = "";
            let innerHtml = textrun.textRun.content;
            let textStyle = textrun.textRun.textStyle
            if (textStyle && Object.keys(textStyle).length !== 0 && textStyle.constructor === Object) {
                for (const [key, value] of Object.entries(
                    textrun.textRun.textStyle
                )) {
                    if (value) {
                    let e = document.createElement(this.tagMap[key]);
                    e.innerHTML = innerHtml;
                    innerHtml = e;
                    }
                }
                span = span + innerHtml.outerHTML;
            } else {
                span = span + innerHtml;
            }
            return span
        },
    },

}
</script>
<style>
*[contenteditable="true"] {
    outline: none;
}
</style>