export const parseEspaceVertsData = list => {
    const categories = list.map( x => x.fields.categorie)
    const categoriesCount = categories.reduce((obj, value) => {
        obj[value] = (obj[value] || 0) + 1
        return obj
    }, {})
    return {
        categories: Object.keys(categoriesCount), // je récupère un tableau représentant les categories
        categoriesCount: Object.values(categoriesCount) // et le nombre d'element dans chaque categories
    }
}
