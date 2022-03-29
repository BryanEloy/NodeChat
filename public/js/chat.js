//Rferencias HTML
const txtMsg= document.querySelector('#txtMsg');
const txtUid= document.querySelector('#txtUid');
const ulUsuarios= document.querySelector('#ulUsuarios');
const ulMensajes= document.querySelector('#ulMensajes');
const btn= document.querySelector('#btn');

let usuario= null;
let socket= null;

//Validar el token del localStorage
const validarJWT= async()=>{
    const token= localStorage.getItem('token');
    if(!token){
        window.location= 'index.html';
        throw new Error('No existe un token en la memoria');      
    }

    const resp= await fetch('http://localhost:8080/api/auth',{
        headers: {'token': token}
    });

    const {usuario: usuarioDB, token: tokenDB}= await resp.json();
    localStorage.setItem('token', tokenDB);
    usuario= usuarioDB;
    document.title= usuario.name;
    await socketConection();
}

const socketConection= async()=>{
    socket= io({
        'extraHeaders':{ 'token': localStorage.getItem('token') }
    });

    socket.on('connect', ()=>{
        console.log('Socket conectado');
    });

    socket.on('disconnect', ()=>{
        console.log('Socket desconectado');
    });

    socket.on('recibir-mensajes', mostrarMensajes);

    socket.on('usuarios-activos', mostrarUsuarios ); 

    socket.on('mensaje-privado', (payload)=>{
        console.log('Privado:', payload)
    });
}

const mostrarUsuarios= (usuarios= [])=>{

    let usersList='';
    usuarios.forEach( ({name, uid})=>{
        usersList +=`
            <li>
                <p>
                    <h5 class="text-success">${name}</h5>
                    <span class="fs-6 text-muted">${uid}</span>
                </p>
            </li>
        `;
        ulUsuarios.innerHTML= usersList;
    });
}

const mostrarMensajes= (mensajes= [])=>{

    let mensajesList='';
    mensajes.forEach( ({mensaje, nombre})=>{
        mensajesList +=`
            <li>
                <p>
                    <span class="text-primary">${nombre}: </span>
                    <span class="fs-6 text-muted">${mensaje}</span>
                </p>
            </li>
        `;
        ulMensajes.innerHTML= mensajesList;
    });
}

txtMsg.addEventListener('keyup', ({keyCode})=>{
    const mensaje= txtMsg.value.trim();
    const uid= txtUid.value.trim();

    if(keyCode !== 13 || mensaje.length===0) return;

    socket.emit('enviar-mensaje', ({mensaje, uid}));
    txtMsg.value='';
});

const main= async()=>{
    //Validar JWT
    await validarJWT();
}

main();

