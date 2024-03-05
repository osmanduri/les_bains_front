const mongoose = require('mongoose')
const moment = require('moment');
moment.locale('fr');

const userSchema = new mongoose.Schema({

    nom: {
        type: String,
        minLength: 2,
        maxLength: 55,
        unique: false,
        trimp: true
    },
    prenom: {
        type: String,
        minLength: 2,
        maxLength: 55,
        unique: false,
        trimp: true
    },
    telephone:{
        type:String,
        required: true,
        unique:false,
        trim:true
    },
    email:{
        type:String,
        required:false,
        unique:true,
        trim:true
    },
    date_naissance:{
        type:String,
        required:false,
        trim:true
    },
    point_fidelite:{
        type:Number,
        required:false,
        default:0
    },

    adresse:{
        type:String,
        trim:true
    },
    ville:{
        type:String,
        trim:true
    },
    date_creation_user: {
        type: Date,
        default: new Date()
    },
    derniere_entree:{
        type: Date,
        default:null
    },
    entree_total:{
        type:Number,
        default:0
    },
    profil_img:{
        type:String,
        default:null
    }

    }, {
        timestamps: true
    }
)

module.exports = mongoose.model('clients', userSchema);