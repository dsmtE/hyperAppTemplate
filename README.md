# hyperApp template for IMACs students

Hello cher IMAC, j'espère que tu vas bien en ce temps difficile de confinement :heart:

Au vu des difficultés des TPs et de la présentation de hyperApp j'ai décidé de te faire un beau template que voici pour simplifier le démarrage des projets dashboard avec hyperApp.

# Mise en place

### Dépendances

il va falloir installer les dépendances pour cela il suffit de taper la commande suivante à la racine du dossier projet :
```
npm install
```

### lancer le serveur

il suffit ensuite de lancer le serveur de dev avec la commande :
```
npm run dev
```

> et voila c'est tout plus qu'à coder :wink:

# Webpack et le setup en quelques lignes

Ce template est configuré pour se servir de différents modules (axios, hyperApp) et via webpack permet de mettre tout en place ensemble.

Il dispose :
- d'un serveur intégré pour pouvoir travailler facilement
- de Babel, un module pour gérer la retro compatibilité avec les vieux navigateurs
- d'un linter, **tu sais le truc chiant qui vérifie que tu écris bien** (pas comme moi en train d'écrire ce markdown à 1h du mat pour les IMACs :satisfied: )
  > Je le laisse car c'est bien et formateur de suivre des conventions et de se forcer à écrire du code lisible mais je suis gentil car la configuration est **souple** (que des warnings pas de blocages majeurs en géneral donc on peut avancer même si on écrit mal)

  > si besoin envoie un MP je te monterai comment les changer, tu peux avoir des préférences comme l'indentation avec 2 espaces au lieu de 4, les points virgules ou même si tu veux tout désactiver ^^
- et enfin de la gestion du Sass (**Syntactically Awesome Style Sheets**) Oui vraiment et c'est génial, tu pourras utiliser des variables dans du css :heart_eyes: (Tu peux cependant utiliser du css classique aussi ça marche) 
    ```scss
    $titleColor: #db7500;

    (...)

    h1 {
        font-family: 'Playfair Display', sans-serif;
        color: $titleColor;
    }

    ```
    
# qu'est ce que ce template contient ?

Tu as donc dans ce template la même structure que dans les TPs à savoir :
- state
- actions
- view

Une vue (view) qui va occuper d'afficher les éléments, le state qui contient les données de notre application et enfin les actions qui définissent tout ce que l'on peut faire ^^

J'ai réalisé :
- un petit exemple de compteur avec deux boutons "+" et "-" pour monter le système d'actions comme vu en TP
```js
// exemple d'action modifiant le state de l'application
increment: () => state => {
    console.log(state)
    return { ...state, count: state.count + 1 } 
    // on retourne le nouveau state avec notre compteur mis à jour
  },
  ```

- un composant personnalisé comme vu dans le Tp de la TODO liste mais en beaucoup (beaucoup (beaucoup (beaucoup) ) ) plus simple pour la clarté
    ```js
    // ici mon composant prend en paramètres des props (un objet javascript qui va contenir des informations pour definir mon composant)
    export default (props) => 
    // ici dans le cadre d'un bouton j'ai besoin de savoir son texte d'affichage (props.text) et de savoir l'action à affecter lorsque je clique dessus (props.onClick)
    h('button', { onclick: props.onClick }, props.text)
    ```
    Je peux ensuite l'utiliser dans ma vue comme cela :
    ```js 
    // je précise ici un objet (accolades) pour les props, il contient bien les props cités précédemment (text et onClick)
    Button({ text: '-', onClick: actions.decrement})
    ```
    :warning: UPDATE :warning:

-  une méthode utilisant axios permettant ici de récupérer notre adresse ip de manière asynchrone ( c'est-à-dire qu'il faut attendre de recevoir les informations avant de faire une autre action comme la modification du state )

    Les méthodes utilisant axios se trouvent dans le sous fichier services/api.js ( elles ne sont pas des actions car elle ne sont pas destiné à modifier le state mais uniquement récupérer les informations depuis l'api)
    ```js
    // ici la fonction est définie asynchrone avec le mot clé async 
    getIp: async () => { 
            // cela permet d'utiliser par la suite le mot clé await qui permet d'attendre que les données aient bien été reçu avant de retourner un résultat
            return await axios.get('https://api.ipify.org?format=json')
                // je peux appliquer un petit filtre sur les données reçus dans le .then avant de les retourner (dépends de chaque api)
                .then(response => response.data.ip) 
                // ensuite la gestion d'erreurs que l'on signale dans la console pour le debug si besoin
                .catch(error => { console.log(error) })
        }
    ```
    je me sers de cette fonction dans mes actions pour mettre à jour mon state
    ```js
    // mon action est ici également une fonction asynchrone
    updateIp: () => async (state, actions) => {
        // Cela permet ici d'attendre que mon ip ait bien été reçue avant de déclencher l'action qui va modifier mon state en conséquence
        const ip = await api.getIp() 
        actions.setIp(ip)
    }
    ```
    ```js
    setIp: ip => state => {
        // on retourne le nouveau state en modifiant l'adresse ip dans notre state
        return { ...state, ip: ip } 
    }
    ```

- un composant personnalisé utilisant la librairie chart.Js pour afficher des données sous forme d'un diagramme en barres :sunglasses:

  Celui-là est un peu plus complexe mais dans les grandes lignes c'est facile :
    ```js
    export default (props) =>
        h('div', {}, [
            h('canvas', { // je crée un élément canvas qui va contenir mon diagramme crée avec chart.Js
                oncreate: (element) => { // au moment de sa création
                    // on récupère le contexte de la balise dans le DOM (le html en gros) (pour que chartJs sache ou afficher son diagramme)
                    const ctx = element.getContext('2d')
                    // on crée notre objet Chart, va voir la doc c'est facile (https://www.chartjs.org/docs/latest/)
                    const c = new Chart(ctx, { 
                        type: 'bar',
                        data: {
                            // j'utilise ici les props que je passe à mon composant
                            labels: props.labels,
                            datasets: [{
                                label: props.title || 'default title',
                                data: props.data
                            }]
                        }
                    })
                    (...)
                },
                // ici je définis la taille de mon canvas avec ses attributs et je passe les valeurs voulues avec mes props
                c.canvas.style.height = props.height + 'px'
                c.canvas.style.width = props.width + 'px'
    
                // si une fonction de callback est passée en paramètres de mes props alors je l'exécute après la création du chart avec celui ci en paramètre
                if(props.callBack !== undefined) { props.callBack(c) }
            })
        ])
    ```
    tu peux ensuite l'utiliser comme cela :
    ```js
    BarChart({
        labels: [...],
        data: [...],
        title: 'ton titre',
        width: 800,
        height: 400
    })
    ```
- Je t'ai également fait un exemple plus poussé avec un nouveau BarChart qui utilise la fonction de callBack pour aller chercher des données via une nouvelle api
(https://opendata.paris.fr/explore/dataset/espaces_verts/api/?disjunctive.type_ev&disjunctive.categorie&disjunctive.adresse_codepostal&disjunctive.presence_cloture&rows=10)
et ensuite mettre à jour l'affichage de celui-ci avec ces nouvelles données

    :warning: UPDATE :warning:

    Cela ressemble à ça :
    ```js
    BarChart({
                (...)
                callBack: async (chart) => { // je définis ici une fonction de callback asynchrone qui va être appelée après la création de mon diagramme
                const list = await api.getEspaceVertsData(200) // La fonction étant asynchrone me permet d'attendre un événement d'une autre fonction asynchrone avec le mot clé await
                // Cela permet ici d'attendre que les données aient bien été reçu avant de faire la suite
                const sorted = parseEspaceVertsData(list) // je trie mes données en fonctions de la forme de l'api (dépendra de chaque api et donnés)

                // Ensuite je mets à jour mon chart avec les données (je suis obligé de faire cela avec chartJs car
                // chartJs fait une copie de donnés, elles ne peuvent donc pas être liées directement à mon state, je suis obligé de lui repréciser les donnés)
                // !!! => Si on veut pouvoir changer les donnés de ce diagramme plus tard il faut sauvegarder l'objet chart
                // passé ici en paramètres dans notre state via une action pour pouvoir y avoir accès plus tard car il n'existe qu'ici que dans notre fonction de callBack
                chart.data.labels = sorted.categories
                chart.data.datasets[0].data = sorted.categoriesCount
                chart.update({duration: 800})

                // Ce n'est pas obligatoire car ici je ne me ressers pas de ses données mais je peux également déclencher une action
                // ensuite afin de modifier le state et sauvegarder mes données dans celui-ci
                actions.saveEspaceVertsData(sorted)
            }
            })
    ```
    Et voilà l'action qui me permet de filter mes données, ici compter le nombre d'espaces verts dans chaque catégorie et ensuite retourner mon nouveau state ( elle se trouve dans le fichier services/sorting.js)
    ```js

    parseEspaceVertsData = list => {
        // on récupère uniquement la catégorie de chaque espace vert
        const catégories = list.map( x => x.fields.catégorie)
        // à l'aide de la fonction reduce je compte le nombre d'éléments dans chaque catégorie
        const categoriesCount = categories.reduce((obj, value) => {
            obj[value] = (obj[value] || 0) + 1
            return obj
        }, {})
        return {
            categories: Object.keys(categoriesCount), // je récupère un tableau représentant les catégories
            categoriesCount: Object.values(categoriesCount) // et le nombre d'éléments dans chaque catégorie
    }
    ```

    Si tu ne comprends pas la fonction reduce ce n'est pas grave c'est un peu complexe... :confused: mais pour faire plus simple on pourrait faire sans comme cela :
    ```js
    const categoriesCount = {} // on définit un objet vide qui va contenir des clés ( nos catégories) associés à une valeur ( la quantité dans cette catégorie)

    categories.foreach( categorie => { // pour chaque élément de la liste des catégories
        if (categoriesCount[categorie] === undefined) {// si notre objet ne la connais pas encore
            categoriesCount[categorie] = 1 // alors on définit la quantité comme étant 1 ( c'est le 1er element de cette catégorie que l'on trouve)
        } else { // sinon on la connaît déjà alors on ajoute 1 à la quantité présente
            categoriesCount[categorie] = categoriesCount[categorie] + 1
        }
    })
    // je peux ensuite faire ce que je veux de cet objet,
    // pour ma part je vais retourner dans un objet deux listes correspondant aux clés et valeurs de l'objet pour les afficher dans mon BarChart ensuite
    ```

### J'espère avoir pu te donner des pistes et une base pour t'aider à démarrer :ok_hand:

### N'hésite pas m'envoyer un MP si tu as des questions, j'y répondrai avec plaisir :smiley: