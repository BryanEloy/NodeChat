const {Router}= require('express');
const { check } = require('express-validator');

const { validate } = require('../middlewares/validate');
const { validateJWT } = require('../middlewares/validateJWT');
const { validateRole } = require('../middlewares/validateRole');

const { createCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { idCategoriaValidator } = require('../helpers/data-validator');


const router= Router();

//Obtener todas las categorias
router.get('/', obtenerCategorias);

//Obtener una categoria en especifico
router.get('/:id',[
    check('id', 'ID invalido').isMongoId(),
    check('id').custom(idCategoriaValidator),
    validate
], obtenerCategoria);

//Crear una categoria
router.post('/',[
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validate
], createCategoria);

//Actualizar categorias
router.put('/:id', [
    validateJWT,
    validateRole,
    check('id', 'ID invalido').isMongoId(),
    check('id').custom(idCategoriaValidator),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validate
],actualizarCategoria);

//Eliminar categorias
router.delete('/:id',[
    validateJWT,
    validateRole,
    check('id', 'ID invalido').isMongoId(),
    check('id').custom(idCategoriaValidator),
    validate
], borrarCategoria);

module.exports= router;