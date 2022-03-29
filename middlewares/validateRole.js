const { response } = require("express");
const res = require("express/lib/response");


const validateRole= (req, resp= response, next)=>{

    if(!req.usuario){
        return res.status(500).json({
            msg:'Se quiere validar el rol sin validar el token primero'
        })
    }

    const {rol, name}= req.usuario;
    if(rol!== 'ADMIN_ROLE'){
        return resp.status(401).json({
            msg: `Usuario: ${name} no es administrador`
        })
    }

    next();
}

module.exports={validateRole}