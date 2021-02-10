<template>
  <div> <vue-file-toolbar-menu :content="my_menu" /> </div>
</template>

<script>
import VueFileToolbarMenu from 'vue-file-toolbar-menu'

export default {
  // https://github.com/motla/vue-file-toolbar-menu
  components: { VueFileToolbarMenu },
  name: 'EditorFileMenu',
  data () { return {  } },

  computed: {
    my_menu () {
      return [
        { text: "File", menu: [
          { text: "Share", icon: "share", click: () => alert("Action 1") },
          { is: "separator" },
          { text: "New", icon: "note_add", click: () => alert("Action 2") },
          { text: "Open", icon: "folder_open", click: () => alert("Action 3") },
          { text: "Delete", icon: "delete", click: () => alert("Action 3")  },
          { text: "Print", icon: "printer", click: () => alert("Action 3")  },
          { text: "Exit", icon: "close", click: () => this.$router.push({ name: 'Home'}) }
        ] },
        { text: "Edit", menu: [
          { text: "Undo", icon: "undo", click: () => alert("Action 1") },
          { text: "Redo", icon: "redo", click: () => alert("Action 2") },
          { is: "separator" },
          { text: "Cut", icon: "content_cut", click: () => document.execCommand("cut") },
          { text: "Copy", icon: "content_copy", click: () => document.execCommand("copy") },
          { text: "Paste", icon: "content_paste", click () { navigator.clipboard.readText().then(text => { document.execCommand("insertText", false, text) }) } }
        ] }
      ]
    }
  }
}
</script>
<style>
  :root {
  --bar-font-color: rgb(32, 33, 36);
  --bar-font-family: Roboto, RobotoDraft, Helvetica, Arial, sans-serif;
  --bar-font-size: 15px;
  --bar-font-weight: 500;
  --bar-letter-spacing: 0.2px;
  --bar-padding: 3px;
  --bar-button-icon-size: 20px;
  --bar-button-padding: 4px 6px;
  --bar-button-radius: 4px;
  --bar-button-hover-bkg: rgb(241, 243, 244);
  --bar-button-active-color: rgb(26, 115, 232);
  --bar-button-active-bkg: rgb(232, 240, 254);
  --bar-button-open-color: rgb(32, 33, 36);
  --bar-button-open-bkg: rgb(232, 240, 254);
  --bar-menu-bkg: white;
  --bar-menu-border-radius: 0 0 3px 3px;
  --bar-menu-item-chevron-margin: 0;
  --bar-menu-item-hover-bkg: rgb(241, 243, 244);
  --bar-menu-item-padding: 5px 8px 5px 35px;
  --bar-menu-item-icon-size: 15px;
  --bar-menu-item-icon-margin: 0 9px 0 -25px;
  --bar-menu-padding: 6px 1px;
  --bar-menu-shadow: 0 2px 6px 2px rgba(60, 64, 67, 0.15);
  --bar-menu-separator-height: 1px;
  --bar-menu-separator-margin: 5px 0 5px 34px;
  --bar-menu-separator-color: rgb(227, 229, 233);
  --bar-separator-color: rgb(218, 220, 224);
  --bar-separator-width: 1px;
  --bar-sub-menu-border-radius: 3px;
}
</style>