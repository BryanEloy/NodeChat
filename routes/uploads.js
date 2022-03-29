const {Router}= require('express');
const { check } = require('express-validator');

const {cargarArchivos, updateImg, showImg, updateImgCloudinary} = require('../controllers/uploads');

const { ColectionValidator } = require('../helpers/data-validator');

const { validate } = require('../middlewares/validate');

const router= Router();

router.post('/', cargarArchivos);

router.put('/:coleccion/:id',[
    check('coleccion', 'Coleccion invalida').not().isEmpty(),
    check('coleccion').custom(c => ColectionValidator(c, ['usuarios', 'productos'] ) ),
    check('id', 'ID invalido').isMongoId(),    
    validate
], updateImgCloudinary);

router.get('/:coleccion/:id',[
    check('coleccion', 'Coleccion invalida').not().isEmpty(),
    check('coleccion').custom(c => ColectionValidator(c, ['usuarios', 'productos'] ) ),
    check('id', 'ID invalido').isMongoId(),    
    validate
], showImg)

module.exports= router;