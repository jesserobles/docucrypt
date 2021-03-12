<template>
  <div class="document-container">
    <v-container>
      <v-row>
        <v-col></v-col>
        <v-col><v-btn @click="deleteElement">Delete</v-btn>
                <v-btn @click="insertElement">Insert</v-btn>
          <v-sheet color="white" elevation="3" height="27.9cm" width="21.6cm">
            <div
              ref="text"
              class="text"
            >
            <!-- :contenteditable="edit_mode" -->
            <!-- v-html="content" -->
                <Paragraph v-for="(para, index) in paragraphs"
                    :key="index"
                    :paragraph="para"
                    :documentId="documentId"
                />
            </div>
          </v-sheet>
        </v-col>
        <v-col></v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import _ from 'lodash'
import CryptoJS from 'crypto-js'
import Paragraph from '@/components/Paragraph.vue'
// for help parsing, take a look at
// https://github.com/SimonGZ/google-docs-converter/blob/master/lib/parser.ts
export default {
    components: {
        Paragraph
    },
  props: {
    documentId: String,
  },
  data() {
    return {
      content: '',
      edit_mode: true,
      tagMap: {
        italic: "em",
        underline: "u",
        bold: "strong",
      },
      paragraphs: [],
    };
  },
  created() {
    window.paragraphs = []
    this.fetchDocument();
    window.CryptoJS = CryptoJS
    window.encryptText = this.encryptText
    window.decryptText = this.decryptText
  },
  methods: {
    encryptText(rawText, pp) {
      let encrypted = CryptoJS.AES.encrypt(rawText, pp)
      return encrypted.toString()
    },
    decryptText(encryptedText, pp) {
      let decrypted = CryptoJS.AES.decrypt(encryptedText, pp)
      return decrypted.toString(CryptoJS.enc.Utf8)
    },
    fetchDocument() {
      this.paragraphs = []
      this.$gapi.getGapiClient().then((gapi) => {
        gapi.client.docs.documents
          .get({
            documentId: this.documentId,
          })
          .then((response) => {
            this.document = response.result;
            this.title = this.document.title;
            this.$emit('title', this.title)
            window.doc = this.document
            this.content = this.gapiToHtml(this.document)
            this.document.body.content.forEach(elem => {
                if (elem.paragraph) {
                    this.paragraphs.push(elem.paragraph)
                    // window.paragraphs.push(elem)
                }
            })
            
          });
      });
    },
    debounceFetchDocument: _.debounce(function () {
        this.fetchDocument()
    }, 1500),
    gapiToHtml(data) {
      let content = data.body.content;
      let html = "";
      content.forEach((elem) => {
        if (elem.paragraph) {
          let paragraph = document.createElement('p')
          elem.paragraph.elements.forEach((textrun) => {
            let innerHtml = textrun.textRun.content;
            let textStyle = textrun.textRun.textStyle
            if (textStyle && Object.keys(textStyle).length !== 0 && textStyle.constructor === Object) {
              for (const [key, value] of Object.entries(
                textrun.textRun.textStyle
              )) {
                if (value) {
                  let e = document.createElement(this.tagMap[key]);
                  e.innerHTML = innerHtml;
                  // window.e = e;
                  innerHtml = e;
                }
              }
              paragraph.innerHTML = paragraph.innerHTML + innerHtml.outerHTML;
            } else {
              paragraph.innerHTML = paragraph.innerHTML + innerHtml;
            }
          });
          html = html + paragraph.outerHTML
        }
      });
      return html;
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
                {documentId: this.documentId, requests: requests}).execute()
            console.log("Done")
        }).then(() => {
          this.debounceFetchDocument()
        })
    },
    insertElement() {
        this.$gapi.getGapiClient().then((gapi) => {
            let requests = [
                {
                    'insertText': {
                        'location': {
                            'index': 1,
                        },
                        'text': "Hello "
                    }
                }
            ]
            gapi.client.docs.documents.batchUpdate(
                {documentId: this.documentId, requests: requests}).execute()
            console.log("Done")
        }).then(() => {
          this.debounceFetchDocument()
        })
    },
    updateContent() {
        // delete content
        // [
        //     {
        //         'deleteContentRange': {
        //             'range': {
        //                 'startIndex': 10,
        //                 'endIndex': 24,
        //             }
        //         }
        //     },
        // ]
        // add content
        // [
        //     {
        //         'insertText': {
        //             'location': {
        //                 'index': 25,
        //             },
        //             'text': text1
        //         }
        //     },
        //             {
        //         'insertText': {
        //             'location': {
        //                 'index': 50,
        //             },
        //             'text': text2
        //         }
        //     },
        //             {
        //         'insertText': {
        //             'location': {
        //                 'index': 75,
        //             },
        //             'text': text3
        //         }
        //     },
        // ]
    },
  },
};
</script>
<style scoped>
/* inspo: https://github.com/delight-im/HTML-Sheets-of-Paper */
.text {
  padding-left: 2cm;
  padding-top: 2cm;
  padding-right: 2cm;
  padding-bottom: 2cm;
}
*[contenteditable="true"] {
  outline: none;
}
.document-container {
    background-color: rgb(250, 250, 250);
}
</style>