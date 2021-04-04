<template>
<div>
    <v-app-bar dense>
        <v-toolbar-title>
            <v-list-item-icon
                style="cursor: pointer;"
                @click="$router.push({ name: 'Home'})"
            >
            <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-icon 
                        v-bind="attrs"
                        v-on="on"
                        color="blue darken-2"
                    >mdi-file-document</v-icon>
                </template>
                <span>Docucrypt Home</span>
            </v-tooltip>
            </v-list-item-icon> 
            <span contenteditable="true" v-on:blur="updateTitle" @keyup.enter="enter">{{ title }}</span>
        </v-toolbar-title> 
    </v-app-bar>
    <div class="toolbar-wrapper">
        <vue-file-toolbar-menu v-for="(content, index) in bars_content" :key="'bar-'+index" :content="content" />
    </div>
</div>
</template>
<script>
import VueFileToolbarMenu from 'vue-file-toolbar-menu'
export default {
    components: {
        VueFileToolbarMenu
    },
    props: {
        isSignedIn: {
            type: Boolean,
            default: false,
        },
        userName: {
            type: String
        },
        title: String
    },
    data: () => ({ 
        drawer: false,
        items: [
            { title: 'Click Me1' },
            { title: 'Click Me2' },
            { title: 'Click Me3' },
            { title: 'Click Me4' },
        ],
        font: 'Arial',
    }),
      computed: {
        bars_content() {
        let that = this
        return [
            [
            {
                text: "File",
                menu: [
                {
                    text: "Save...",
                    icon: "save",
                    click: () =>
                    that.save()
                },
                { is: "separator" },
                { text: "Print...", icon: "print", click: () => window.print() },
                { is: "separator" },
                {
                    text: "Close",
                    icon: "close",
                    click() {
                        that.close()
                    },
                },
                ],
            },
            {
                text: "Edit",
                menu: [
                { text: "Cut", icon: "content_cut", click: () => document.execCommand("cut") },
                { text: "Copy", icon: "content_copy", click: () => document.execCommand("copy") },
                {
                    text: "Paste",
                    icon: "content_paste",
                    click() {
                    navigator.clipboard.readText().then((text) => {
                        document.execCommand("insertText", false, text);
                    });
                    },
                },
                ],
            },
            ],
            [
            {
                icon: "format_align_left",
                title: "Align left",
                hotkey: this.isMacLike ? "shift+command+l" : "ctrl+shift+l",
                click: () => document.execCommand("justifyLeft"),
            },
            {
                icon: "format_align_center",
                title: "Align center",
                hotkey: this.isMacLike ? "shift+command+e" : "ctrl+shift+e",
                click: () => document.execCommand("justifyCenter"),
            },
            {
                icon: "format_align_right",
                title: "Align right",
                hotkey: this.isMacLike ? "shift+command+r" : "ctrl+shift+r",
                click: () => document.execCommand("justifyRight"),
            },
            {
                icon: "format_align_justify",
                title: "Justify content",
                hotkey: this.isMacLike ? "shift+command+j" : "ctrl+shift+j",
                click: () => document.execCommand("justifyFull"),
            },
            { is: "separator" },
            {
                icon: "format_bold",
                title: "Bold",
                hotkey: this.isMacLike ? "command+b" : "ctrl+b",
                click: () => document.execCommand("bold"),
            },
            {
                icon: "format_italic",
                title: "Italic",
                hotkey: this.isMacLike ? "command+i" : "ctrl+i",
                click: () => document.execCommand("italic"),
            },
            {
                icon: "format_underline",
                title: "Underline",
                hotkey: this.isMacLike ? "command+u" : "ctrl+u",
                click: () => document.execCommand("underline"),
            },
            {
                icon: "format_strikethrough",
                title: "Strike through",
                click: () => document.execCommand("strikethrough"),
            },
            { is: "separator" },
            {
                html:
                '<div class="ellipsis" style="width: 80px; font-size: 95%;">' +
                this.font +
                "</div>",
                title: "Font",
                chevron: true,
                menu: this.font_menu,
                menu_height: 200,
            },
            { is: "separator" },
            {
                icon: "format_list_numbered",
                title: "Numbered list",
                click: () => document.execCommand("insertOrderedList"),
            },
            {
                icon: "format_list_bulleted",
                title: "Bulleted list",
                click: () => document.execCommand("insertUnorderedList"),
            },
            { is: "separator" },
            {
                icon: "format_indent_increase",
                title: "Increase indent",
                click: () => document.execCommand("indent"),
            },
            {
                icon: "format_indent_decrease",
                title: "Decrease indent",
                click: () => document.execCommand("outdent"),
            },
            { is: "separator" },
            // { is: DemoCustomButton, text: "Your component", click: () => alert("Your custom action!") },
            { is: "separator" },
            {
                html: "<b>H1</b>",
                title: "Header 1",
                click: () => document.execCommand("formatBlock", false, "<h1>"),
            },
            {
                html: "<b>H2</b>",
                title: "Header 2",
                click: () => document.execCommand("formatBlock", false, "<h2>"),
            },
            {
                html: "<b>H3</b>",
                title: "Header 3",
                click: () => document.execCommand("formatBlock", false, "<h3>"),
            },
            {
                icon: "format_clear",
                text: "Clear",
                title: "Clear format",
                click() {
                document.execCommand("removeFormat");
                document.execCommand("formatBlock", false, "<div>");
                },
            },
            ],
        ];
        },
        userAvatar() {
            if (this.isSignedIn) {
                return this.userName[0]
            }
            return '<v-avatar>mdi-account-circle</v-avatar>'
        },
        sign() {
            if (this.isSignedIn) {
                return 'Logout'
            }
            return 'Login'
        },
        logfunction() {
            if (this.isSignedIn) {
                return this.logout
            }
            return this.login
        }
    },
    methods: {
        toggleDrawer() {
            this.$emit('toggledrawer');
        },
        login() {
            this.$emit('login');
        },
        logout() {
            this.$emit('logout');
        },
        close() {
            this.$router.push({name: 'Home'})
        },
        save() {
            this.$emit('save')
        },
        updateTitle(e) {
            this.$emit("updateTitle", e.srcElement.innerText)
        },
        enter(e) {
            e.preventDefault();
            console.log("enter")
        },
    },
}
</script>
<style>
body {
    background-color: rgb(248, 249, 250);
    box-shadow: none;
}
::selection {
    background-color: rgb(186, 212, 253);
}
:root {
    --demo-font-color: #222;
    --demo-bars-bkg: rgb(255, 255, 255);
    --demo-bars-shadow: 0 1px 3px 1px rgba(60, 64, 67, 0.15);
    --demo-bars-padding: 5px;
    --demo-bars-border-radius: 1px;
    --demo-text-bkg-color: white;
    --demo-text-box-shadow: 0 1px 3px 1px rgba(60, 64, 67, 0.15);
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
.bars > .bar:first-child {
    border-bottom: 1px solid rgb(218, 220, 224);
    margin-bottom: 3px;
}

select {
  outline: none;
}
.main {
  width: 100%;
  height: 100%;
}
.title {
  text-align: center;
  font-size: 50px;
  padding-top: 30px;
}
.subtitle {
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 50px;
}

.bars {
  background-color: var(--demo-bars-bkg, white);
  border-radius: var(--demo-bars-border-radius, 5px);
  box-shadow: var(--demo-bars-shadow, 0 0 20px black);
  padding: var(--demo-bars-padding, 8px);
  transition: .5s;
}
::v-deep.bars * {
  transition: font-size .1s linear, padding .1s linear, margin .1s linear;
}
.bar-button {
    cursor: pointer;
}
.toolbar-wrapper {
    padding-left: 5px;
    padding-right: 5px;
}
.v-text-field {
    color: red !important;
}
</style>