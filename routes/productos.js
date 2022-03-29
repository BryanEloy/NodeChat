const {Router}= require('express');
const { check } = require('express-validator');

const { validate } = require('../middlewares/validate');
const { validateJWT } = require('../middlewares/validateJWT');
const { validateRole } = require('../middlewares/validateRole');
const { validateCategoria } = require('../middlewares/validateCategoria');

const { obtenerProductos, borrarProducto, actualizarProducto, obtenerProducto, crearProducto } = require('../controllers/productos');

const { idProductoValidator } = require('../helpers/data-validator');

const router= Router();

//Crear un producto
router.post('/',[
    validateJWT,
    validateCategoria,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'La categoria es obligatoria').not().isEmpty(),
    validate
], crearProducto);

//Obtener un producto en especifico
router.get('/:id',[
    check('id', 'ID invalido').isMongoId(),
    check('id').custom(idProductoValidator),
    validate
], obtenerProducto);

//Obtener todos los productos
router.get('/', obtenerProductos);

//Actualizar producto
router.put('/:id', [
    validateJWT,
    validateRole,
    validateCategoria,
    check('id', 'ID invalido').isMongoId(),
    check('id').custom(idProductoValidator),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validate
],actualizarProducto);

//Eliminar productos
router.delete('/:id',[
    validateJWT,
    validateRole,
    check('id', 'ID invalido').isMongoId(),
    check('id').custom(idProductoValidator),
    validate
], borrarProducto);

module.exports= router;

