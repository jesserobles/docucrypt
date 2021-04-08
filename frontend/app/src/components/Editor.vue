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
      pp: null,
      document: null,
      metadata: null,
      body: null,
      encrypted: false,
      userId: null,
      ownerIsMe: false,
      documentLocalData: null,
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
    };
  },
  created() {
    if (!this.$root.authenticated) {
      this.$router.push({name: 'Home'})
    }
    window.decryptText = this.decryptText
    window.encryptText = this.encryptText
    this.userId = this.$gapi.getUserData().id
    const storageKey = this.getStorageKey()
    let documentLocalData = localStorage.getItem(storageKey)
    if (localStorage.getItem(storageKey))
      documentLocalData = JSON.parse(localStorage.getItem(storageKey))
    this.documentLocalData = documentLocalData
    this.fetchDocument()
  },
  methods: {
    getStorageKey() {
        return `_DC_${this.userId}_${this.documentId}`
    },
    logInput(e) {
      this.html_ = e.target.innerHTML
      console.log(this.html_)
      window.html_ = this.html_
    },
    encryptText(rawText, pp) {
      let encrypted = CryptoJS.AES.encrypt(rawText, pp)
      return encrypted.toString()
    },
    decryptText(encryptedText, pp) {
      let decrypted = CryptoJS.AES.decrypt(encryptedText, pp)
      return decrypted.toString(CryptoJS.enc.Utf8)
    },
    fetchMetadata() {
      this.$gapi.getGapiClient().then((gapi) => {
        gapi.client.drive.files.get({
            fileId: this.documentId,
            fields: 'id,name,mimeType,appProperties'
        }).then((response) => {
            let metadata = response.result.appProperties
            console.log("Doc metadata: " + JSON.stringify(metadata))
            return metadata
        })
      })
    },
    getDH(prime) {
      const dhObject = this.dh.createDiffieHellman(prime, 'hex');
      const publicKeyObj = dhObject.generateKeys().toString('hex');
      const privateKey = dhObject.getPrivateKey('hex')
      let keyData = {
        "privateKey": privateKey,
        "prime": prime,
        "publicKey": publicKeyObj
      }
      return keyData
      
    },
    fetchDocument() {
      this.$emit("toggleOverlay", true)
      this.$gapi.getGapiClient().then((gapi) => {
        gapi.client.drive.files.get({
            fileId: this.documentId,
            fields: 'id,name,mimeType,appProperties'
        }).then((response) => {
          let metadata = response.result.appProperties
          if (metadata) {
            this.encrypted = true
            let encrytionKeyName = metadata.encryptionKeyName
            if (!this.documentLocalData) {
              // We're the viewer.
              const prime = this.getPrime()
              const dhObject = this.dh.createDiffieHellman(prime, 'hex');
              const viewerPublicKeyObj = dhObject.generateKeys().toString('hex');
              const viewerPrivateKey = dhObject.getPrivateKey('hex')
              const authorPublicKey = metadata.authorPublicKey
              let sharedSecret = dhObject.computeSecret(this.fromHexString(authorPublicKey)).toString('hex')
              let documentLocalData = {
                "privateKey": viewerPrivateKey,
                "prime": prime,
                "sharedSecret": sharedSecret
              }
              localStorage.setItem(this.getStorageKey(), JSON.stringify(documentLocalData))
              metadata['viewerPublicKey'] = viewerPublicKeyObj
              gapi.client.drive.files.update(
                {fileId: this.documentId, appProperties: metadata}
              ).then(() => {
                if (encrytionKeyName == "author") {
                  this.$router.push({ name: 'Home'})
                }
              })
            } else {
              // We're the author. On save, need to check if we need to reset encrytion using shared secret.
              if (encrytionKeyName == "author") {
                this.pp = this.documentLocalData.privateKey    
              } else {
                let sharedSecret = this.documentLocalData.sharedSecret
                if (sharedSecret)
                  this.pp = this.documentLocalData.sharedSecret
              }
              this.metadata = metadata
              }
            
          }
          gapi.client.docs.documents.get({
              documentId: this.documentId,
          }).then((resp) => {
            this.document = resp.result;
            this.title = this.document.title;
            this.$emit('title', this.title)
            this.body = this.document.body.content
            window.doc = this.document
            let contentDiv = document.createElement('div')
            this.body.forEach(element => {
                if ('paragraph' in element) {
                    contentDiv.appendChild(this.convertParagraph(element.paragraph))
                }
            });
            this.html = contentDiv.innerHTML
            this.html_ = contentDiv.innerHTML
            this.$emit("toggleOverlay", false)
          }).catch((err) => {
            console.log(err)
            this.$emit("toggleOverlay", false)
          })
        })
      })
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
        // Either new document, or document was shared with us.
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
        // Document exists. We are either author opening it, or viewer.
        // If we're author, check encryptionKeyName. If it's author,
        // Check for viewerPublicKey. If it doesn't exist, do nothing, pp
        // is documentLocalData.privateKey. Otherwise, generate sharedSecret
        // using viewerPublicKey.
        // documentLocalData exists. Get encryp 
        // We still create the DH using the stored prime number
        // const author = this.dh.createDiffieHellman(128)
        // const prime = author.getPrime('hex').toString('hex')
        // const author = this.dh.createDiffieHellman(prime, 'hex');
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
    getPrime() {
      const urlParams = new URLSearchParams(window.location.search);
      let prime = urlParams.get("p")
      if (prime){
        return prime
      }
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
      if (this.encrypted && this.pp) {
        content = this.decryptText(content, this.pp)
      }
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
          return
        }
        if (content.length == 0) {
          return
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
      return elements
    },
    save() {
      // If we're the author, if encryption key is author,
      // check if viewerPublicKey present in documentappProperties.
      // If it is, we need to compute the secret, update this.pp,
      // updatelocalStorageObject, and doc appProperties.
      let doc = this.document
      let requests = []
      let lastElementIndex = doc.body.content.length - 1
      let startIndex = 1
      let endIndex = doc.body.content[lastElementIndex].endIndex - 1 || -1
      if (endIndex > startIndex) {
        requests.push([
            {
                'deleteContentRange': {
                    'range': {
                        'startIndex': startIndex,
                        'endIndex': endIndex,
                    }
                }
            },
        ])
      }
      console.log(`documentLocalData: ${JSON.stringify(this.documentLocalData)}`)
      console.log(`appProperties: ${JSON.stringify(this.metadata)}`)
      let encrytionKeyName = this.metadata.encryptionKeyName
      if (encrytionKeyName == "author" && this.metadata.viewerPublicKey) {
        console.log("Need to update key!")
        let viewerPublicKey = this.metadata.viewerPublicKey
        const prime = this.documentLocalData.prime
        const dhObject = this.dh.createDiffieHellman(prime, 'hex')
        const privateKey = this.documentLocalData.privateKey
        dhObject.setPrivateKey(this.fromHexString(privateKey))
        let sharedSecret = dhObject.computeSecret(this.fromHexString(viewerPublicKey)).toString('hex')
        console.log("Shared Secret: " + sharedSecret)
        this.pp = sharedSecret
        this.documentLocalData["sharedSecret"] = sharedSecret
        localStorage.setItem(this.getStorageKey(), JSON.stringify(this.documentLocalData))
        this.metadata['encryptionKeyName'] = "shared"
        this.$gapi.getGapiClient().then((gapi) => {
           this.$emit("toggleOverlay", true)
           gapi.client.drive.files.update(
              {fileId: this.documentId, appProperties: this.metadata}
            ).then(() => {
              Array.prototype.push.apply(requests, this.convertHtml(this.html_))
              gapi.client.docs.documents.batchUpdate(
                        {documentId: this.documentId, requests: requests}
              ).then(this.fetchDocument)
            })
        })

      } else {
        this.$emit("toggleOverlay", true)
        Array.prototype.push.apply(requests, this.convertHtml(this.html_))
        this.$gapi.getGapiClient().then((gapi) => {
          gapi.client.docs.documents.batchUpdate(
                    {documentId: this.documentId, requests: requests}
          ).then(this.fetchDocument)
        })
      }
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