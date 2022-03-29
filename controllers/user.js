const {response, request}= require('express');
const bcrypt= require('bcryptjs');
const Usuario= require('../models/usuario');

const userGet= async (req= request, res= response)=> {
    const {limit=5, start=0 }= req.query;

    const [total, usuarios]= await Promise.all([
        Usuario.countDocuments({state: true}),
        Usuario.find({state: true})
            .skip(Number(start))
            .limit(Number(limit))        
    ])

    res.json({
        total,
        usuarios
    });
}

const userDelete= async(req, res= response)=> {
    const {id}= req.params;

    const usuarioEliminado= await Usuario.findByIdAndUpdate(id, {state:false});

    res.json({
        usuarioEliminado
    });
}

const userPut= async (req, res= response)=> {
    const {id}= req.params;
    const {_id,password, google,email, ...data}= req.body;

    if(password){
        //Encryptar password
        const salt= bcrypt.genSaltSync();
        data.password= bcrypt.hashSync(password, salt);
    }

    const usuario= await Usuario.findByIdAndUpdate(id, data);

    res.json({
        msg: 'put API ',
        usuario
    });
}

const userPost= async (req, res= response)=> {

    const {name, email, rol, password}= req.body;
    const usuario= new Usuario({name, email, rol, password});
    
     //Encriptar la contraseña
     const salt= bcrypt.genSaltSync();
     usuario.password= bcrypt.hashSync(password, salt);
     //Guardar en DB
    await usuario.save();
    
    res.json({
        msg: 'post API ',
        usuario
    });
}

const userPatch= (req, res= response)=> {
    res.json({
        msg: 'patch API '
    });
}

module.exports= {userGet, userDelete, userPut, userPost, userPatch};