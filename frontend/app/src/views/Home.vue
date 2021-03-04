<template>
<div>
  <v-row>
    <v-col>
      <v-sheet
        min-height="40vh"
        rounded="lg"
        class="grey lighten-2"
      >
        <v-container>
          <v-row
            align="center"
            justify="center"
          >
            <v-col
              class="mt-2"
              cols="12"
            >
              <v-row
                align="center"
                justify="center"
              >
                <strong>Create a new document</strong>
              </v-row>
            </v-col>

            <v-col
              cols="6"
              md="2"
            >
              <v-hover
                v-slot="{ hover }"
              >
                <v-card
                  height="25vh"
                  rounded
                  :elevation="hover ? 12 : 2"
                  :to="'/doc'"
                >
                  <v-container fill-height fluid>
                    <v-row
                      align="center"
                      justify="center"
                    >
                      <v-icon
                        x-large
                        color="blue darken-2"
                      >mdi-plus-thick</v-icon>
                    </v-row>
                  </v-container>
                </v-card>
              </v-hover>
            </v-col>
          </v-row>
        </v-container>
      </v-sheet>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <v-container>
        <DocumentTable />
      </v-container>
    </v-col>
  </v-row>
</div>
</template>

<script>
// @ is an alias to /src
import DocumentTable from '@/components/DocumentTable.vue'

export default {
  components: {
    DocumentTable
  },
  name: 'Home',
  methods: {
    cardAction() {
      alert("clicked")
    }
  },
  data: () => ({
  }),
}
</script>
