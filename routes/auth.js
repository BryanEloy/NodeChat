const {Router}= require('express');
const { check } = require('express-validator');

const { validate } = require('../middlewares/validate');
const { validateJWT}= require('../middlewares/validateJWT');
const { login, googleSignIn, setToken } = require('../controllers/auth');

const router= Router();

router.post('/login',[
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'Contraseña invalida').not().isEmpty(),
    validate
], login);

router.post('/google',[
    check('id_token', 'Token de google es necesario').not().isEmpty(),
    validate
], googleSignIn);

router.get('/', validateJWT, setToken)

module.exports= router;