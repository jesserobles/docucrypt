<template>
    <v-simple-table class="row-pointer">
    <template v-slot:default>
        <thead>
        <tr>
            <th width="5%" class="text-left">
            
            </th>
            <th class="text-left">
            Name
            </th>
            <th class="text-left">
            Author
            </th>
            <th class="text-left">
            Modfied
            </th>
            <th class="text-left">
            
            </th>
        </tr>
        </thead>
        <tbody>
        <tr
            class="rounded-xl"
            v-for="item in documents"
            :key="item.text"
            @click="$router.push({ name: 'Document', params: {id: item.documentId, title: item.title}})"
        > 
            <td><v-icon v-text="item.icon" :color="item.color"></v-icon></td>
            <td>{{ item.title }}</td>
            <td>{{ item.author }}</td>
            <td>{{ item.timestamp }}</td>
            <td>
                <v-menu
                    left
                    bottom
                >
                    <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        icon
                        v-bind="attrs"
                        v-on="on"
                    >
                        <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                    </template>

                    <v-list>
                    <v-list-item
                        v-for="n in 5"
                        :key="n"
                        @click="() => {}"
                    >
                        <v-list-item-title>Option {{ n }}</v-list-item-title>
                    </v-list-item>
                    </v-list>
                </v-menu>
            </td>
        </tr>
        </tbody>
    </template>
    </v-simple-table>
</template>
<script>
export default {
    props: {
        loggedIn: {
            type: Boolean,
            default: false
        },
        documents: Array

    },
    data: () => ({
        
    }),

    created() {

    },
    methods: {

    },
}
</script>
<style lang="css" scoped>
.row-pointer >>> tbody tr :hover {
  cursor: pointer;
}
</style>