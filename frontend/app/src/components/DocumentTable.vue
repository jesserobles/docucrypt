<template>
    <v-simple-table>
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
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="item in documents"
            :key="item.text"
        > 
            <td><v-icon v-text="item.icon" :color="item.color"></v-icon></td>
            <td>{{ item.text }}</td>
            <td>{{ item.author }}</td>
            <td>{{ item.timestamp }}</td>
        </tr>
        </tbody>
    </template>
    </v-simple-table>
</template>
<script>
export default {
    data: () => ({
        documents: [
        {text: 'Document 1', icon: 'mdi-file-document', color: 'blue darken-2', timestamp: 'Jan 1, 2021', author: 'me'},
        {text: 'Document 2', icon: 'mdi-file-document', color: 'blue darken-2', timestamp: 'Jan 1, 2021', author: 'me'},
        {text: 'Document 3', icon: 'mdi-file-document', color: 'blue darken-2', timestamp: 'Jan 1, 2021', author: 'me'},
        {text: 'Document 4', icon: 'mdi-file-document', color: 'blue darken-2', timestamp: 'Jan 1, 2021', author: 'me'},
        {text: 'Document 5', icon: 'mdi-file-document', color: 'blue darken-2', timestamp: 'Jan 1, 2021', author: 'me'},
        {text: 'Document 6', icon: 'mdi-file-document', color: 'blue darken-2', timestamp: 'Jan 1, 2021', author: 'me'},
        {text: 'Document 7', icon: 'mdi-file-document', color: 'blue darken-2', timestamp: 'Jan 1, 2021', author: 'me'},
        {text: 'Document 8', icon: 'mdi-file-document', color: 'blue darken-2', timestamp: 'Jan 1, 2021', author: 'me'},
        {text: 'Document 9', icon: 'mdi-file-document', color: 'orange darken-2', timestamp: 'Jan 1, 2021', author: 'me'},
        ]
    }),
}
</script>