const Usuario= require('../models/usuario')
const Producto= require('../models/producto')

const modelValidator= async( coleccion, id, res)=>{
    let modelo;

   switch (coleccion) {

     case 'usuarios':
       modelo= await Usuario.findById(id);
       if(!modelo){
         return false
       }
       break;

     case 'productos':
       modelo= await Producto.findById(id);
       if(!modelo){
         return false
       }
       break;
   
     default:
      res.status(500).json({msg: 'Endpoint inavilitado'});
      return false
   }

   return modelo;
}

module.exports=modelValidator;