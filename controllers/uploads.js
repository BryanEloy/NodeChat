const path = require("path");
const fs = require("fs");

const cloudinary= require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL );

const { response } = require("express");

const uploadFile= require('../helpers/upload-file');
const modelValidator = require("../helpers/modelValidator");

const cargarArchivos= async(req, res= response)=>{
  
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo ) {
      return res.status(400).json({msg: 'No se cargaron archivos.'});
    }

    try {
      const nameFile= await uploadFile(req.files, 'imgs');
      res.json({nameFile});

    } catch (error) {
      res.status(400).json({
        msg: error
      })
    }
}

const updateImg= async(req, res= response)=>{

  const{id, coleccion}= req.params;

  //Si no hay archivos para subir
  if(!req.files){
    return res.status(400).json({msg: `No se encontro ninguna imagen para actualizar ${coleccion}`})
  }

  //Validamos que el modelo exista
   let modelo = await modelValidator(coleccion, id);
   if( !modelo){
    return res.status(400).json({
      msg: `No existe un ${coleccion} con el id: ${id}`
    });
   }

   //En caso de que exista una imagen previa guardada en el modelo la borra 
   if(modelo.img){
     //Borrar imagen del servidor
     const pathImg= path.join(__dirname, '../uploads', coleccion, modelo.img)
     if( fs.existsSync(pathImg)){
       fs.unlinkSync(pathImg)
     }
   }

   //Guarda la imagen dentro del servidor en la carpeta de la coleccion
   const nameFile= await uploadFile(req.files, coleccion);
   modelo.img= nameFile;
   modelo.save();

   res.json( modelo )
}

const updateImgCloudinary= async(req, res= response)=>{

  const{id, coleccion}= req.params;

  //Si no hay archivos para subir
  if(!req.files){
    return res.status(400).json({msg: `No se encontro ninguna imagen para actualizar ${coleccion}`})
  }

  //Validamos que el modelo exista
   let modelo = await modelValidator(coleccion, id);
   if( !modelo){
    return res.status(400).json({
      msg: `No existe un ${coleccion} con el id: ${id}`
    });
   }
   //En caso de que exista una imagen previa guardada en el modelo la borra 
   if(modelo.img){
    console.log(modelo.img);
     //Obtener el nombre de la imagen en el servidor
     const nombreArr= modelo.img.split('/');
     const nombre= nombreArr[nombreArr.length -1];
     //Quitamos la extension del nombre
     const [public_id]= nombre.split('.');
      //Borrar la imagen antigua del servidor
     cloudinary.uploader.destroy(public_id)
   }

   //Guarda la imagen dentro del servidor cloudinary
   const { tempFilePath }= req.files.archivo;
   const {secure_url}= await cloudinary.uploader.upload(tempFilePath);
   modelo.img= secure_url;

   //Guardar datos en nuestra DB
   await modelo.save()
   res.json( modelo)
}

const showImg= async(req, res= response)=>{

  const{id, coleccion}= req.params;

  //Validamos que el modelo exista
  let modelo = await modelValidator(coleccion, id);
  if(!modelo){
    return res.status(400).json({
      msg: `No existe un ${coleccion} con el id: ${id}`
    });
   }

   if(modelo.img){
     //Mostrar la imagen
     const pathImg= path.join(__dirname, '../uploads', coleccion, modelo.img)
     if( fs.existsSync(pathImg)){
       return res.sendFile(pathImg);
     }
   }

  const pathNoImg= path.join(__dirname, '../assets/no-image.jpg' );
  return res.sendFile(pathNoImg);

}

module.exports= {
  cargarArchivos,
  updateImg,
  updateImgCloudinary,
  showImg
}