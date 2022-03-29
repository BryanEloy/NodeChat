const { response } = require("express");

const Producto= require('../models/producto');

const crearProducto= async(req, resp=response)=>{

    const name= req.body.name;
    const {state, usuario, ...body}= req.body;

    const productoDB= await Producto.findOne({name});

    if(productoDB){
        return resp.status(400).json({
            msg: `El producto: ${name} ya fue registrado`
        });
    }
    //Generar la informacion a guardar
    const data={
        body,
        name,
        categoria: req.categoria._id,
        usuario: req.usuario._id
    }
    const producto= new Producto(data);

    //Guardar en DB
    await producto.save();

    resp.status(201).json(producto);
}

const obtenerProductos= async(req, resp=response)=>{
    const {limit=5, start=0 }= req.query;

    const [total, productos]= await Promise.all([
        Producto.countDocuments({state: true}),
        Producto.find({state: true})
            .populate('usuario', 'name')
            .populate('categoria', 'name')
            .skip(Number(start))
            .limit(Number(limit))        
    ])

    resp.json({
        total,
        productos
    });
}

const obtenerProducto= async(req, resp=response)=>{
    const {id}= req.params;

    const productoDB= await Producto.findById(id)
        .populate('usuario', 'name')
        .populate('categoria', 'name')

    resp.json(productoDB);   
}

const actualizarProducto= async(req, resp=response)=>{
    const {id}= req.params;
    const {state, usuario, ...data}= req.body;

    if(data.categoria) data.categoria= req.categoria._id;
    data.usuario= req.usuario._id;
    const producto= await Producto.findByIdAndUpdate(id, data, {new: true});

    resp.json(producto);
}

const borrarProducto= async(req, resp=response)=>{
    const {id}= req.params;

    const productoEliminado= await Producto.findByIdAndUpdate(id, {state:false});

    resp.json(productoEliminado);
}

module.exports={
    crearProducto, 
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}