const fs =  require('fs');
const GuardarFotoFisico = async ({base64, nombreArchivo, extension = '.jpg', subRutaArchivo = 'solicitudes/'}) => {

    try {
       if(base64){
        const nombreImagen = `${nombreArchivo}${extension}`
        const subRuta = `${subRutaArchivo}${nombreImagen}`; //`${subRutaArchivo}${nombreImagen}`;
        const rutaPath = `${process.cwd()}/public/${subRutaArchivo}`;
        let rutaArchivo = `${process.cwd()}/public/${subRutaArchivo}${nombreImagen}`;
        if(!fs.existsSync(rutaPath)){
            console.log('entro al IFFF');
            fs.mkdirSync(rutaPath, {recursive:true});
        }
        console.log('rutaArchivo: ', rutaArchivo);
        const rutaFinal = await fs.promises.writeFile(rutaArchivo, base64, 'base64'); 
        return subRuta;
       }else {
            console.log('entro al ELSEEE');
            return null;
       }
        
    } catch (error) {
        console.log('error ppal imagenes: ', error);
        throw(error);
    }
    
};

module.exports = {
    GuardarFotoFisico
};
