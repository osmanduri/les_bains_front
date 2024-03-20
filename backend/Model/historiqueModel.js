const mongoose = require('mongoose')
const moment = require('moment');
moment.locale('fr');

const historiqueSchema = new mongoose.Schema({

    user_id: {
        type: String,
        minLength: 2,
        maxLength: 55,
        unique: false,
        trimp: true
    },
    nom:{
        type:String
    },
    prenom:{
        type:String
    },
    entree:{
        type: Date,
        default:null
    },
    entree_formated:{
        type:String,
        default:""
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
        unique:false,
        trim:true
    },
    point_fidelite:{
        type:Number,
        required:false,
        default:0
    },
    }, {
        timestamps: true
    }
)

module.exports = mongoose.model('historique', historiqueSchema);