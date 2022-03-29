const {Schema, model}= require('mongoose');

const CategoriaSchema= Schema({
    name:{
        type:String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    state:{
        type: Boolean,
        default: true,
        required: true
    },
    usuario:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});

CategoriaSchema.methods.toJSON= function(){
    const {__v, state, ...categoria}= this.toObject();
    return categoria;
}


module.exports= model('Categoria', CategoriaSchema);