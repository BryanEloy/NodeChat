const express = require('express');
const cors= require('cors');
const fileUpload= require('express-fileupload')

const { dbConnection } = require('../DB/config');
const { socketController } = require('../sockets/contollers');

class Server{
    constructor(){
        this.app=  express();
        this.port=process.env.PORT;
        this.server= require('http').createServer(this.app);
        this.io= require('socket.io')(this.server);

        //endpoints al server
        this.paths={
            auth:       '/api/auth',
            categorias: '/api/categorias',
            user:       '/api/usuarios',
            productos:  '/api/productos',
            buscar:     '/api/buscar',
            uploads:    '/api/uploads'
        }

        //Conexion a DB
        this.connection();
        //Middlewares
        this.middlewares();
        //Rutas de app
        this.routes();
        //sockets
        this.sockets();
    }

    async connection(){
        await dbConnection();
    }

    middlewares(){
        this.app.use(cors());
        //Lectura y parseo del body
        this.app.use( express.json() );
        //Directorio Publico
        this.app.use(express.static('public'));
        //FileUpload- Carga de archivos
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/'
        }));
    }

    sockets(){
        this.io.on('connection', (socket)=> socketController(socket, this.io));
    }

    routes(){
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.user, require('../routes/user'));        
        this.app.use(this.paths.productos, require('../routes/productos'));        
        this.app.use(this.paths.buscar, require('../routes/buscar'));        
        this.app.use(this.paths.uploads, require('../routes/uploads'));        
    }

    listen(){
        this.server.listen(this.port);
    }
}

module.exports= Server;;