const {response, request}=  require('express');
const JWT= require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validateJWT= async(req=request, resp=response, next)=>{
    const token= req.header('token');

    if(!token){
        return resp.status(401).json({
            msg: 'Token invalido'
        });
    }

    try {
        const {uid}= JWT.verify(token, process.env.SECRETKEY);
        //Extraemos el user id y lo mandamos en la request
        const usuario= await Usuario.findById(uid);
        if(!usuario ){
            return resp.status(401).json({
                msg: 'El usuario no existe en bd'
            });
        }

        //Validar que el usuario este activo
        if(!usuario.state ){
            return resp.status(401).json({
                msg: 'Usuario inactivo'
            });
        }

        req.usuario=usuario;
        next();

    } catch (error) {
        console.log(error);
        resp.status(401).json({
            msg: 'Token invalido'
        });
    }   
}

module.exports= {validateJWT};