const mongoose = require('mongoose')
const moment = require('moment');
moment.locale('fr');

const administrateurSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        minLength: 6
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    date_creation_user: {
        type: String,
        default: moment().format('LLL')
    },
    profil_img:{
        type:String,
        default:null
    }
    }, {
        timestamps: true
    }
)

module.exports = mongoose.model('administrateur', administrateurSchema);