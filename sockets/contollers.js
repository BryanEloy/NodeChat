const { Socket } = require("socket.io");
const { JWTValidator } = require("../helpers/data-validator");
const Chat= require('../models/chat');

const chat= new Chat();

const socketController= async( socket= new Socket(), io )=>{

    const usuario= await JWTValidator(socket.handshake.headers.token);
    if(!usuario) return socket.disconnect();

    //Agregamos el usuario a los usuarios conectados
    chat.conectarUsuario(usuario);
    //Mostramos los usuarioa activos 
    io.emit('usuarios-activos', chat.usuariosArr );
    //Mostramos los ultimos 10 mensajes
    socket.emit('recibir-mensajes', chat.ultimos10);

    //Conectarlo a una sala especial con el id del usuario
    socket.join( usuario.id);

    //Eliminar usuario desconectado
    socket.on('disconnect', ()=>{
        chat.desconectarUsuario(usuario.id);
        io.emit('usuarios-activos', chat.usuariosArr );
    });

    //Enviar un mensaje a todos los usuarios conecatos
    socket.on('enviar-mensaje', ({uid, mensaje})=>{

        if(uid){
            //Mensaje privado
            socket.to(uid).emit('mensaje-privado', {de: usuario.name, mensaje})

        }else{
            chat.enviarMensaje(usuario.id, usuario.name, mensaje);
            io.emit('recibir-mensajes', chat.ultimos10);   
        }
        
    })
}

module.exports={
    socketController
}