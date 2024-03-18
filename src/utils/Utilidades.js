// aqui se define metodos globales o estructuras que seran accedidos desde services
const ejecutarQuery = async ({query, replacements, BD}) => {
    try {
        console.log(`query: ${JSON.stringify(query, null, 4)}, replacements: ${JSON.stringify(replacements, null,4)}`);
        const json = {
            //criterioBusqueda: '7721912'
            ...replacements
        };
        return await BD.query(query,{
            type: 'SELECT',
            replacements: json
        });
    } catch (error) {
        console.log('error: ', error);
        throw(error);
    }
}
const generateUniqueId5Dig = () => {
    return Math.floor(Math.random() * 90000) + 10000;
}

module.exports = {
    ejecutarQuery,
    generateUniqueId5Dig
}