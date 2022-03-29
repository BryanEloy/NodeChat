const { response } = require("express");

const Categoria= require('../models/categoria');

const obtenerCategorias= async(req, resp=response)=>{
    const {limit=5, start=0 }= req.query;

    const [total, categorias]= await Promise.all([
        Categoria.countDocuments({state: true}),
        Categoria.find({state: true})
            .populate('usuario', 'name')
            .skip(Number(start))
            .limit(Number(limit))        
    ])

    resp.json({
        total,
        categorias
    });
}

const obtenerCategoria= async(req, resp=response)=>{
    const {id}= req.params;

    const categoriaDB= await Categoria.findById(id).populate('usuario', 'name');

    resp.json({
        categoriaDB,
    });
    
}

const actualizarCategoria= async(req, resp=response)=>{
    const {id}= req.params;
    const data={
        name: req.body.name.toUpperCase(),
        usuario: req.usuario._id
    };

    const categoria= await Categoria.findByIdAndUpdate(id, data, {new: true});

    resp.json({
        categoria
    });

}

const borrarCategoria= async(req, resp=response)=>{
    const {id}= req.params;

    const categoriaEliminada= await Categoria.findByIdAndUpdate(id, {state:false});

    resp.json({
        categoriaEliminada
    });
}

const createCategoria= async(req, resp=response)=>{
    const name= req.body.name.toUpperCase();

    const categoriaDB= await Categoria.findOne({name});

    if(categoriaDB){
        return resp.status(400).json({
            msg: `La categoria ${name} ya fue registrada`
        });
    }

    //Generar la informacion a guardar
    const data={
        name, 
        usuario: req.usuario._id
    }
    const categoria= new Categoria(data);

    //Guardar en DB
    await categoria.save();
    
    resp.status(201).json(categoria);
}

module.exports={
    createCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}