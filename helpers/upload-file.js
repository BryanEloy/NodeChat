const path  = require("path");
const { v4: uuidv4 } = require('uuid');

const uploadFile= ( files, folder='', extensionesValidas=['png', 'jpg', 'gif', 'jpeg'] )=>{

    return new Promise((resolve, reject)=>{

        const {archivo} = files;
        const nombreSplit= archivo.name.split('.');
        const extension= nombreSplit[ nombreSplit.length - 1];

        //Validar formato valido de imagen
        if(!extensionesValidas.includes(extension)){
            return reject('Formato de imagen invalido')
        }

        const nameFile= uuidv4()+ '.'+ extension;

        const uploadPath =path.join( __dirname, '../uploads/', folder, nameFile);
        archivo.mv(uploadPath, (err)=> {
        if (err) {
            reject(err);
        }
    
        resolve(nameFile);
        });
    })

}

module.exports= uploadFile;