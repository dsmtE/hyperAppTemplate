# hyperApp template for IMACs students

Hello cher IMAC, j'espère que tu vas bien en ce temps difficile de confinement ^^

Au vu des difficultés des TPs et de la presentation de hyperApp j'ai décidé de te faire un beau template que voici pour simplifier le démarrage des projets dashboard avec hyperApp.

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
- d'un linter, **tu sais le truc chiant qui vérifie que tu écris bien** (pas comme moi en train d'écrire ce markdown à 1h du mat pour les IMACs x) )
  > Je le laisse car c'est bien et formateur de suivre des conventions et de se forcer à écrire du code lisible mais je suis gentil car la configuration est **souple** (que des warning pas de blocage majeur en géneral donc on peut avancer même si on écrit mal)

  > si besoin envoi un MP je te monterai comment le désactiver ^^
- et enfin de la gestion du Sass (**Syntactically Awesome Style Sheets**) Oui vraiment et c'est génial, tu pourra utiliser des variables dans du css (Tu peux cependant utiliser du css classique aussi ça marche) ^^
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

J'ai réaliser :
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
// ici mon composant prends en paramètres des props (un objet javascript qui va contenir des informations pour definir mon composant)
export default (props) => 
// ici dans le cadre d'un bouton j'au besoin de savoir son texte d'affichage (props.text) et de savoir l'action à affecter lorsque je clique dessus (props.onClick)
h('button', { onclick: props.onClick }, props.text)
```
Je peux ensuite l'utiliser dans ma vue comme cela :
```js 
// je précise ici un objet (accolades) pour les props, il contient bien les props citées précédemment text et onClick
Button({ text: '-', onClick: actions.decrement})
```
-  une méthode utilisant axios permettant ici de récupérer notre adresse ip de manière asynchrone ( c'est à dire qu'il faut attendre de recevoir les informations depuis l'API et ensuite modifier notre state )
```js

getIpFromApi: () => (state, actions) => {
    const request = axios.get('https://api.ipify.org?format=json')
    // notre Promise via la librairie axios

    request.then(response => {
        // gestion des données reçus
        // response contient le retour de la requete envoyée à l'API
        // ici je déclenche une nouvelle action avec la réponse que je viens 
        // de recevoir pour définir mon adresse ip dans mon state
        return actions.setIp(response.data.ip)
      })
      // ensuite la gestion d'erreurs que l'on signal dans la console pour le debug si besoin
      .catch(error => {console.log(error)}) 
  }
```

- un composant personnalisé utilisant la librairie chart.Js pour afficher des données sous forme d'un diagramme en barres
Celui là est un peu plus complexe mais dans les grandes lignes c'est facile :
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
                // ici je défini la taille de mon canvas avec ses attributs et je passe les valeur voulus avec mes props
                width: props.width,
                height: props.height,
                // ici un peu de css pour avoir un fond blanc
                style: 'background-color: #fff;'
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
- Je t'est également fait un exemple plus poussé avec un nouveau BarChart qui utilise une fonction de callBack pour aller chercher des données via une nouvelle api
(https://opendata.paris.fr/explore/dataset/espaces_verts/api/?disjunctive.type_ev&disjunctive.categorie&disjunctive.adresse_codepostal&disjunctive.presence_cloture&rows=10)
et ensuite mettre à jour l'affichage de celui-ci avec ces nouvelles données

  > c'est sûrement mal foutu car j'ai fait ça à 1h30 du mat mais c'est fonctionnel x)

Cela ressemble à ça :
```js
BarChart({
            (...)
            callBack: (chart) => { // je défini ici une fonction de callback qui va être appellé après la création de mon diagramme
                actions.getEspaceVertsDataFromApi({ // je fait un appel à l'action getEspaceVertsDataFromApi qui fait un appel à une base de donnée
                    count: 200, // je lui passe en paramètre le nombre de ligne que je veux appeler via mon api
                    callBack: (labels, data) => { // et une autre fonction de callBack qui sera appellé seulement après que mes données aient été reçus
                        // ce qui me permet de mettre à jour l'affichage de mon diagramme qu'à ce moment là, une fois les données reçus
                        chart.data.labels = labels
                        chart.data.datasets[0].data = data
                        chart.update({duration: 800})
                    }
                })
            }
        })
```
Et voilà l'action qui me permet de filter mes données, ici compter le nombre d'espace vert dans chaque catégorie et ensuite retourner mon nouveau state
```js
parseEspaceVertsData: list => state => {
        const categories = list.map( x => x.fields.categorie) // on récupère uniquement la catégorie de chaque espace vert
        // à l'aide de la fonction reduce je compte le nombre d'éléments dans chaque catégories
        const categoriesCount = categories.reduce((obj, value) => {
            obj[value] = (obj[value] || 0) + 1;
            return obj;
        }, {})
        return {
            ...state,
            espacesVertsData: {
                categories: Object.keys(categoriesCount), // je récupère un tableau représentant les categories
                categoriesCount:  Object.values(categoriesCount) // et le nombre d'element dans chaque categories
            }
        }
    }
```

Si tu ne comprends pas la fonction reduce c'est pas grave c'est un peu complexe... mais pour faire plus simple on pourrait faire sans comme cela :
```js
const categoriesCount = {} // on defini un objet vide qui va contenir des clés ( nos catégories) associés à une valeurs ( la quantité dans cette catégorie)

categories.foreach( categorie => { // pour chaque élément de la liste des catégories
    if (categoriesCount[categorie] === undefined) {// si notre objet ne la connais pas encore
        categoriesCount[categorie] = 1 // alors on défini la quantité comme étant 1 ( c'est le 1er element de cette categorie que l'on trouve)
      } else { // sinon on la connais déjà alors on ajoute 1 à la quantité présente
        categoriesCount[categorie] = categoriesCount[categorie] + 1
      }
})
// je peux ensuite faire ce que je veux de cet objet,
// pour ma part je vais stocker dans le state deux listes correspondantes aux clés et valeurs de  l'objet pour les afficher dans mon BarChart ensuite
```


## J'espère avoir pu te donné des pistes et une base pour t'aider à démarrer ;)

## N'hésite pas m'envoyer un MP si tu as des questions, j'y répondrai avec plaisir ^^ 

## maintenant c'est l'heure de dormir pour moi :)
