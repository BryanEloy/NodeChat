const { validationResult } = require('express-validator');
 
 const validate= (req, res, next)=>{
    //Mostrar errores
    const errors= validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json(errors);
    }
    next();
 }

 module.exports={
     validate
 }
 //** */