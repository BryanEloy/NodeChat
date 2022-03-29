const {Router}= require('express');
const { check } = require('express-validator');

const {userGet, userDelete, userPut, userPost, userPatch}= require('../controllers/user');
const { rolValidator, emailValidator, idValidator } = require('../helpers/data-validator');

const { validate } = require('../middlewares/validate');
const { validateJWT } = require('../middlewares/validateJWT');
const { validateRole } = require('../middlewares/validateRole');

//---------
const router= Router();

router.get('/', userGet);

router.put('/:id',[
    check('id', 'ID invalido').isMongoId(),
    check('id').custom(idValidator),
    check('rol').custom(rolValidator),
    validate
],userPut);

router.post('/',[
    check('email', 'El correo es invalido').isEmail(),
    check('email').custom(emailValidator),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña debe tener mas de 6 caracteres').isLength({min:6  }),
    //check('rol', 'Rol invalido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    //check('rol').custom(rolValidator),
    validate
], userPost);

router.delete('/:id',[
    validateJWT,
    validateRole,
    check('id', 'ID invalido').isMongoId(),
    check('id').custom(idValidator),
    validate
], userDelete);

router.patch('/', userPatch);


module.exports= router;