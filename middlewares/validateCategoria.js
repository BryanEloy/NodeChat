const {response, request}=  require('express');

const Categoria = require('../models/categoria');

const validateCategoria= async(req=request, resp=response, next)=>{
    
    if(!req.body.categoria){
        return next();
    }
    const name= req.body.categoria.toUpperCase();

    try {
        const categoria= await Categoria.findOne({name})
        if(!categoria ){
            return resp.status(401).json({
                msg: 'Categoria invalida'
            });
        }

        req.categoria=categoria;
        next();

    } catch (error) {
        console.log(error);
    }   
}

module.exports= {validateCategoria};