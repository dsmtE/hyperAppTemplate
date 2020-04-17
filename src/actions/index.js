import api from '../services/api'

export default {
    increment: () => state => {
        console.log(state)
        return { ...state, count: state.count + 1 } // on retourne le nouveau state avec notre compteur mis à jour
    },
    decrement: () => state => {
        console.log(state)
        return { ...state, count: state.count - 1 }
    },

    setIp: ip => state => {
        return { ...state, ip: ip } // on retourne le nouveau state en modifiant l'adresse ip dans notre state
    },

    updateIp: () => async (state, actions) => { // mon action est ici une fonction asynchrone
        const ip = await api.getIp() // Cela permet ici d'attendre que mon ip ait bien été reçue avant de déclencher l'action qui va modifier mon state en conséquence
        actions.setIp(ip)
    },
    saveEspaceVertsData: sorted => state => {
        return { ...state, espacesVertsData: { ...sorted } }
    }
}
