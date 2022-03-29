const { response } = require("express");
const bcrypt= require('bcryptjs');

const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/generarJWT");
const { googleVerify } = require("../helpers/googleVerify");
const res = require("express/lib/response");

const login= async(req, resp= response)=>{

    const {email, password}= req.body;
    try {
        //Verificar si el email existe
        const usuario= await Usuario.findOne({email});
        if(!usuario){
            return resp.status(400).json({
                msg: 'Usuario/contraseña invalidos'
            })
        }
        //Verificar si el usuario esta activo
        if(!usuario.state){
            return resp.status(400).json({
                msg: 'Usuario inactivo'
            })
        }
        //verificar la contraseña
        const validPass= bcrypt.compareSync(password, usuario.password);
        if(!validPass){
            return resp.status(400).json({
                msg: 'Usuario/contraseña invalidos'
            })
        }
        //Generar JWT
        const token= await generarJWT(usuario.id);

        resp.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error);
        return resp.status(500).json({
            msg: 'Algo salio mal del lado del servidor'
        })
    }
}

const googleSignIn= async(req, resp= response)=>{

    const {id_token}= req.body;

    try {
        const {name, img, email}= await googleVerify(id_token);
        let usuario= await Usuario.findOne({email});

        if(!usuario){
            //Crear usuario
            const data={
                email,
                name,
                img,
                password: 'xd',
                google: true,
                rol: 'USER_ROLE'
            };
            usuario= new Usuario(data);
            await usuario.save();
        };
        //Validar sis el usuario sigue activo
        if(!usuario.state){
            return resp.status(401).json({
                msg: 'Usuario Inactivo'
            })
        };

        //Generar JWT
        const token= await generarJWT(usuario.id);

        resp.json({
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        return resp.status(400).json({
            ok: false,
            msg: 'No se pudo verificar el token'
        })
    }
}

const setToken= async (req, resp= response)=>{
    const {usuario} = req;
    //Generar JWT
    const token= await generarJWT(usuario.id);
    resp.json({usuario, token})
}

module.exports= {
    login,
    googleSignIn,
    setToken
}