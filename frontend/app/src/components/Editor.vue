<template>
  <div class="document-container">
    <v-container>
      <v-row>
        <v-col></v-col>
        <v-col>
          <v-sheet color="white" elevation="3" height="27.9cm" width="21.6cm">
            <div ref="text"
                class="text"
                contenteditable="true"
                @input="logInput"
                v-html="html">
                
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
// for help parsing, take a look at
// https://github.com/SimonGZ/google-docs-converter/blob/master/lib/parser.ts
export default {
  props: {
    documentId: String,
  },
  data() {
    return {
      html: '<p></p>',
      html_: '<p></p>',
      pp: 'mysecret',
      document: {},
      docMetadata: {},
      body: [],
      edit_mode: true,
      tagMap: {
        italic: "em",
        underline: "u",
        bold: "strong",
      },
      jsonTagMap: {
        "em": "italic",
        "i": "italic",
        "u": "underline",
        "strong": "bold",
        "b": "bold"
      },
      // paragraphs: [],
    };
  },
  created() {
    window.paragraphs = []
    this.fetchDocument();
    this.logPrime()
    window.save_ = this.save
    window.createDH = this.createDH
    window.CryptoJS = CryptoJS
    window.encryptText = this.encryptText
    window.decryptText = this.decryptText
    window.paragraphToJson = this.paragraphToJson
  },
  methods: {
    logInput(e) {
      this.html_ = e.target.innerHTML
      console.log(this.html_)
      window.html_ = this.html_
    },
    encryptText(rawText, pp) {
      console.log("Encrypting")
      let encrypted = CryptoJS.AES.encrypt(rawText, pp)
      return encrypted.toString()
    },
    decryptText(encryptedText, pp) {
      console.log("Decrypting")
      let decrypted = CryptoJS.AES.decrypt(encryptedText, pp)
      return decrypted.toString(CryptoJS.enc.Utf8)
    },
    fetchDocument() {
      this.$emit("toggleOverlay", true)
      this.$gapi.getGapiClient().then((gapi) => {
        gapi.client.docs.documents.get({
            documentId: this.documentId,
        }).then((response) => {
            this.document = response.result;
            this.body = this.document.body.content
            this.title = this.document.title;
            this.$emit('title', this.title)
            window.doc = this.document
            let contentDiv = document.createElement('div')
            this.body.forEach(element => {
                if ('paragraph' in element) {
                    contentDiv.appendChild(this.convertParagraph(element.paragraph))
                }
            });
            this.html = contentDiv.innerHTML
            this.html_ = contentDiv.innerHTML
            window.html_ = this.html_
            window.convertHtml = this.convertHtml
            // this.createDH()
            this.$emit("toggleOverlay", false)
          }).then(() => {
            gapi.client.drive.files.get({
                fileId: this.documentId,
                fields: 'id,name,mimeType,appProperties'
            }).then((response) => {
                let metadata = response.result.appProperties
                if (metadata != undefined) {
                  this.docMetadata = metadata
                  console.log("Doc metadata: " + JSON.stringify(metadata))
                }
            })
          })
      });
    },
    fromHexString(hexString) {
      return new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    },
    createDH() {
      /*
        Create a DH prime if needed, check doc metadata, store
        object as needed. Document metadata:
        {
          "authorPublicKey": "24ddd36afe7e7d22bb74143bf8c98a8d",
          "viewerPublicKey": "09ee34b857225b62dd0d1ca6039766c5",
          "encryptionKeyName": "shared"
        }
        "viewerPublicKey" may not be present
        Local storage object:
        {
          "authorPrivateKey": "",
          "prime": ""
        }
      */
      let metadata = this.metadata
      let storageKey = `_DC_${this.documentId}`
      let documentLocalData = localStorage.getItem(storageKey)
      if (documentLocalData == null) {
        documentLocalData = {}
        if (_.isEmpty(metadata)) {
          // New document
          console.log("No metadata. New document")
          const author = this.dh.createDiffieHellman(128)
          const prime = author.getPrime('hex').toString('hex')
          let authorPublicKey = author.generateKeys().toString("hex")
          documentLocalData['prime'] = prime
          documentLocalData["privateKey"] = author.getPrivateKey("hex")
          documentLocalData['publicKey'] = authorPublicKey
          localStorage.setItem(storageKey, JSON.stringify(documentLocalData))
          this.pp = author.getPrivateKey("hex")
          // update document metadata
          metadata = {
            'authorPublicKey': authorPublicKey,
            'encryptionKeyName': "author"
          }
          this.metadata = metadata
          return {
            'documentLocalData': documentLocalData,
            'metadata': metadata
          }
          /*
          this.$gapi.getGapiClient().then((gapi) => {
            gapi.client.drive.files.update(
              { 
                fileId: this.documentId, 
                appProperties: metadata
              }
            ).execute()
          })
          */
        } else {
          // Existing document. User is viewer opening for the first time. 
          // Check for authorPublicKey, encryptionKeyName
          // let authorPublicKey = metadata.authorPublicKey
          // let encryptionKeyName = metadata.encryptionKeyName
          const urlParams = new URLSearchParams(window.location.search);
          let prime = urlParams.get("p")
          const viewer = this.dh.createDiffieHellman(prime, 'hex')
          let viewerPublicKey = viewer.generateKeys("hex")
          let authorPublicKey = metadata.authorPublicKey
          metadata["viewerPublicKey"] = viewerPublicKey
          let sharedSecret = viewer.computeSecret(this.fromHexString(authorPublicKey))
          documentLocalData["prime"] = prime
          documentLocalData["privateKey"] = viewer.getPrivateKey("hex")
          documentLocalData["publicKey"] = viewerPublicKey
          documentLocalData["sharedSecret"] = sharedSecret

          return {
            'documentLocalData': documentLocalData,
            'metadata': metadata
          }
          //localStorage.setItem(storageKey, JSON.stringify(documentLocalData))
          /*
          this.$gapi.getGapiClient().then((gapi) => {
            gapi.client.drive.files.update(
              { 
                fileId: this.documentId, 
                appProperties: metadata
              }
            ).execute()
          })*/
        }
      } else {
        // documentLocalData exists. Get encryp 
        // We still create the DH using the stored prime number
        const prime = author.getPrime('hex').toString('hex')
        const author = this.dh.createDiffieHellman(prime, 'hex');
        // let authorPublicKey = author.generateKeys().toString("hex")
        // Check documentLocalData for sharedSecret. If it doesn't exist, we need to generate it using view public key
        let sharedSecret = documentLocalData.sharedSecret
        if (sharedSecret == undefined){
          let viewerPublicKey = metadata.viewerPublicKey
          if (viewerPublicKey) {
            sharedSecret = ''
          }
        }      
      }
      
      // gapi.client.drive.files.update({fileId: this.documentId, appProperties: {"authorPublicKey": publicKey}}).execute()
      // const alice = dh.createDiffieHellman(128);
      // const aliceKey = alice.generateKeys();
      // const prime = alice.getPrime('hex').toString('hex');
    },
    logPrime() {
      const urlParams = new URLSearchParams(window.location.search);
      let prime = urlParams.get("p")
      console.log("prime: " + prime)
    },
    convertParagraph(paragraph) {
        let pElement = document.createElement('p')
        let elements = paragraph.elements
        elements.forEach(element => {
            let textRun = this.convertRun(element.textRun)
            pElement.appendChild(textRun)
            
        });
        return pElement
    },
    convertRun(textRun) {
      let content = textRun.content
      content = this.decryptText(content, this.pp)
      // if this.decryptText(, this.pp)
      let textStyle = textRun.textStyle
      let span = document.createElement('span')
      span.innerText = content
      if (!(textStyle && Object.keys(textStyle).length !== 0 && textStyle.constructor === Object)) {
          return span
      }
      for (const [key, value] of Object.entries(textStyle)) {
          if (value) {
              let e = document.createElement(this.tagMap[key])
              e.appendChild(span)
              span = e
          }
      }
      return span
    },
    convertHtml(htmlString) {
      let cursor = 1
      let html = document.createElement('div')
      html.innerHTML = htmlString
      let paragraphs = html.getElementsByTagName('p')
      let jsonElements = []
      paragraphs.forEach(paragraph => {
        let elements = this.paragraphToJson(paragraph)
        elements.forEach(e => {
          let content = e.textRun.content
          // console.log(content)
          if (content == undefined) return
          content = this.encryptText(content, this.pp) + "\n"
          let length = content.length
          if (length == 0) {
            return
          }
          let endIndex = cursor + length
          e['startIndex'] = cursor
          e['endIndex'] = endIndex
          let command = {
            'insertText': {
              'location': {
                'index': cursor
              },
              'text': content
            }
          }
          
          jsonElements.push(command)
          let textStyle = e.textRun.textStyle
          if (textStyle && Object.keys(textStyle).length !== 0 && textStyle.constructor === Object) {
            jsonElements.push(this.style(e))
          }
          cursor = cursor + length
        })
      })
      return jsonElements
    },
    style(element) {
     let textStyle = element.textRun.textStyle
     let range = {'startIndex': element.startIndex, 'endIndex': element.endIndex}
     let fields = Object.keys(textStyle).join(',')
     return {
       'updateTextStyle': {
         'range': range,
         'textStyle': textStyle,
         'fields': fields
       }
     }
    },
    paragraphToJson(paragraph) {
      let elements = []
      paragraph.childNodes.forEach(element => {
        // let content = element.innerHTML.replace(/<br\s*\/?>/mg,"\n")
        let content
        if (element.constructor == Text) {
          content = element.textContent
        } else {
          content = element.innerText
        }
        if (content == undefined) {
          console.log(element)
          content=''
        }
        
        let textStyle = {}
        if (!element.tagName) {
          // This is a plain text run
          elements.push({
            textRun: {
              'content': content,
              'textStyle': textStyle
            }
          })

        } else {
          let counter = 0
          while (element && (element.tagName != undefined) && (element.tagName != "SPAN")) {
            counter ++
            console.log(element)
            let styleKey = this.jsonTagMap[element.tagName.toLowerCase()]
            textStyle[styleKey] = true
            element = element.childNodes[0]
            if (counter == 100) break
          }
          console.log(element)
          elements.push({
            textRun: {
              'content': content,
              'textStyle': textStyle
            }
          })
        }
      })
      // elements[elements.length - 1].textRun.content = elements[elements.length - 1].textRun.content + '\n'
      return elements
    },
    debounceFetchDocument: _.debounce(function () {
        this.fetchDocument()
    }, 1000),
    fetchAfterDelete(wait) {
      this.$emit("toggleOverlay", true)
      // this.paragraphs = []
      let that = this
      console.log('fetchingDocument')
      _.delay(function () {
        that.$gapi.getGapiClient().then((gapi) => {
          gapi.client.docs.documents
            .get({
              documentId: that.documentId,
            })
            .then((response) => {
              that.document = response.result;
              that.title = that.document.title;
              that.$emit('title', that.title)
              window.doc = that.document
              that.document.body.content.forEach(elem => {
                  if (elem.paragraph) {
                      that.paragraphs.push(elem.paragraph)
                      // window.paragraphs.push(elem)
                  }
              })
              
            });
        });
      }, wait)
      console.log('Fetched')
      this.$emit("toggleOverlay", false)
    },
    deleteDocContents(){
      let doc = this.document
      let lastElementIndex = doc.body.content.length - 1
      let startIndex = 1
      let endIndex = doc.body.content[lastElementIndex].endIndex - 1
      let requests = [
          {
              'deleteContentRange': {
                  'range': {
                      'startIndex': startIndex,
                      'endIndex': endIndex,
                  }
              }
          },
      ]
      this.$gapi.getGapiClient().then((gapi) => {
        gapi.client.docs.documents.batchUpdate(
                {documentId: this.documentId, requests: requests}
        ).execute()
        this.fetchAfterDelete(500)
      })
    },
    saveDocument() {

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
    updateText: _.debounce(function () {
      // do what you need here
      console.log("In test function")
      let requests = this.convertHtml(this.html_)
      if (requests.length > 0) {
        this.$gapi.getGapiClient().then((gapi) => {
          gapi.client.docs.documents.batchUpdate(
                    {documentId: this.documentId, requests: requests}).execute()
        }).then(this.debounceFetchDocument)
      }
      this.$emit("toggleOverlay", false)
      console.log("requests:")
      console.log(requests)
      return requests
    }, 1000),
    save() {
      let doc = this.document
      let lastElementIndex = doc.body.content.length - 1
      let startIndex = 1
      let endIndex = doc.body.content[lastElementIndex].endIndex - 1 || -1
      if (endIndex > startIndex) {
        let requests = [
            {
                'deleteContentRange': {
                    'range': {
                        'startIndex': startIndex,
                        'endIndex': endIndex,
                    }
                }
            },
        ]
        this.$emit("toggleOverlay", true)
        this.$gapi.getGapiClient().then((gapi) => {
          gapi.client.docs.documents.batchUpdate(
                    {documentId: this.documentId, requests: requests}).execute()
        })
      }
      // this.fetchAfterDelete()
      this.updateText()
      
      // requests = this.convertHtml(this.html_)
      console.log("Deleted Documents")
      // return requests
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
div.text >>> p {
  margin-bottom: 0px;
}
*[contenteditable="true"] {
  outline: none;
}
.document-container {
    background-color: rgb(250, 250, 250);
}

</style>