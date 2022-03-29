const JWT= require('jsonwebtoken');

const Categoria = require('../models/categoria')
const Role= require('../models/roles')
const Usuario= require('../models/usuario')
const Producto= require('../models/producto')


const rolValidator= async(rol = '')=>{
    const exist= await Role.findOne({rol})
    if(!exist){
        throw new Error(`El ${rol} no es un rol valido`)
    }
}

const emailValidator= async(email='')=>{
    const exist= await Usuario.findOne({email})
    if(exist){
        throw new Error(`El ${email} ya fue registrado`)
    }
}

const idValidator= async(id)=>{
    const exist= await Usuario.findById(id);
    if(!exist){
        throw new Error(`El id: ${id} buscado, no existe`)
    }
}

const idCategoriaValidator= async(id)=>{
    const exist= await Categoria.findById(id);
    if(!exist){
        throw new Error(`El id: ${id} buscado, no existe `);
    }
}

const idProductoValidator= async(id)=>{
    const exist= await Producto.findById(id);
    if(!exist){
        throw new Error(`El id: ${id} buscado, no existe `);
    }
}

const ColectionValidator= (coleccion='', coleccionesValidas=[])=>{
    const exist= coleccionesValidas.includes(coleccion);
    if(!exist){
        throw new Error(`La coleccion: ${coleccion} no existe en la DB`);
    }
    return exist;
}

const JWTValidator=async(token='')=>{
    try {
        if(!token) return null
        
        const {uid}= JWT.verify(token, process.env.SECRETKEY);
        const usuario= await Usuario.findById(uid);

        if(!usuario) return null;
        return usuario;

    } catch (error) {
        return null
    }
}

module.exports={
    rolValidator,
    emailValidator,
    idValidator,
    idCategoriaValidator,
    idProductoValidator,
    ColectionValidator,
    JWTValidator
}