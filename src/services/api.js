import axios from 'axios'

export default {
    getEspaceVertsData: async (count) => {
        return await axios.get('https://opendata.paris.fr/api/records/1.0/search/?dataset=espaces_verts&facet=categorie&rows=' + (count || 10))
            .then(response => response.data.records)
            .catch(error => { console.log(error) })
    },

    getIp: async () => {
        return await axios.get('https://api.ipify.org?format=json')
            .then(response => response.data.ip)
            .catch(error => { console.log(error) })
    }
}
