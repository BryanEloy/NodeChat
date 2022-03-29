const { response } = require("express");
const {ObjectId}= require('mongoose').Types;

const Usuario= require('../models/usuario');
const Categoria= require('../models/categoria');
const Producto= require('../models/producto');

const coleccionesActuales=[
    'categorias',
    'productos',
    'roles',
    'usuarios'
]

const buscarUsuarios= async(termino='', res=response)=>{
    
    const esMongoID= ObjectId.isValid( termino); //true or false if it is an mongoID

    if( esMongoID){
        const usuario= await Usuario.findById(termino);
            return res.json({
            results: (usuario) ?[usuario] :[]
        })
    }

    const regex= new RegExp(termino, 'i');
    const busqueda= await Usuario.find({
        $or: [{name: regex}, {email:regex}]
    });

    res.json({
        results: busqueda
    });
}

const buscarCategorias= async(termino='', res=response)=>{

    const esMongoID= ObjectId.isValid( termino); //true or false if it is an mongoID

    if( esMongoID){
        const categoria= await Categoria.findById(termino);
            return res.json({
            results: (categoria) ?[categoria] :[]
        })
    }

    const regex= new RegExp(termino, 'i');
    const busqueda= await Usuario.find({name: regex});

    res.json({
        results: busqueda
    });
}

const buscarProductos= async(termino='', res=response)=>{
    const esMongoID= ObjectId.isValid( termino); //true or false if it is an mongoID

    if( esMongoID){
        const producto= await Producto.findById(termino)
            .populate('categoria', 'name')
        return res.json({
            results: (producto) ?[producto] :[]
        })
    }

    const regex= new RegExp(termino, 'i');

    /*Buscar productos por categorias
    const categories = await Category.find({ name: regex, status: true})
    
    const products = await Product.find({
        $or: [...categories.map( category => ({
            category: category._id
        }))],
        $and: [{ status: true }]
    }).populate('category', 'name')
    */ 
    const busqueda= await Producto.find({name: regex})
        .populate('categoria', 'name')

    res.json({
        results: busqueda
    });
}


const buscar= async(req, res=response)=>{

    const {coleccion, termino}= req.params;

    if( !coleccionesActuales.includes(coleccion) ){
        res.status(400).json({
            msg: `La coleccion: ${coleccion} no existe en DB`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;

        case 'categorias':
            buscarCategorias(termino, res);
            break;

        case 'productos':
            buscarProductos(termino, res);
            break;

        default:
            resp.status(500).json({
                msg: 'Busqueda no definida para esta coleccion'
            });
    }

}

module.exports={
    buscar
}