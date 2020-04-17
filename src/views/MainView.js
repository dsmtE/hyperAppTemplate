import { h } from 'hyperapp'

import Button from '../components/Button'
import BarChart from '../components/BarChart'

import { parseEspaceVertsData } from '../services/sorting'
import api from '../services/api'

export default (state, actions) =>
    h('div', {}, [
        h('h1', {}, 'HyperApp Template'),
        h(
            'p',
            { oncreate: () => {actions.updateIp()} },
            'ton ip est :' + state.ip
        ),
        h('p', {}, 'count :' + state.count),
        Button({ text: '-', onClick: actions.decrement }),
        Button({ text: '+', onClick: actions.increment }),
        BarChart({
            labels: ['React', 'Angular', 'Vue', 'Hyperapp', 'Omi'],
            data: [135850, 52122, 148825, 16939, 9763],
            title: 'exemple de BarChart',
            width: 800,
            height: 400
        }),
        BarChart({
            labels: [],
            data:  [],
            title: 'nombre d\'espaces verts par catégories',
            width: 800,
            height: 400,
            callBack: async (chart) => { // je défini ici une fonction de callback asynchrone qui va être appellé après la création de mon diagramme
                const list = await api.getEspaceVertsData(200) // La fonction étant asynchrone me permet d'attendre un événement d'une autre fonction asynchrone avec le mot clé await
                // Cela permet ici d'attendre que les données aient bien été reçu avant de faire la suite
                const sorted = parseEspaceVertsData(list) // je trie mes données en fonctions de la forme de l'api (dépendra de chaque api et données)

                // Ensuite je mets à jour mon chart avec les données (je suis obligé de faire cela avec chartJs car
                // chartJs fait une copie de donnés, elles ne peuvent donc pas être liées directement à mon state, je suis obligé de lui repréciser les donnés)
                // !!! => Si on veut pouvoir changer les donnés de ce diagramme plus tard il faut sauvegarder l'objet chart
                // passé ici en paramètres dans notre state via une action pour pouvoir y avoir accès plus tard car il existe seulement ici que dans notre fonction de callBack
                chart.data.labels = sorted.categories
                chart.data.datasets[0].data = sorted.categoriesCount
                chart.update({duration: 800})

                // Ce n'est pas obligatoire car ici je ne me ressers pas de ses données mais je peux également déclencher une action
                // ensuite afin de modifier le state et sauvegarder mes données dans celui-ci
                actions.saveEspaceVertsData(sorted)
            }
        })
    ])
