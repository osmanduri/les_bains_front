const jwt = require('jsonwebtoken')
const userModel = require('../../Model/userModel')
const ObjectID = require('mongoose').Types.ObjectId

module.exports.verifyToken = async(req, res, next) => {

    const tokenHeader = req.headers.token;

    if (tokenHeader) {
        const token = tokenHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SEC, (err, user) => {
            if (err) {
                return res.send('Token is not valid !')
            }

            req.user = user;
            next();
        })
    } else {
        return res.send('Vous devez vous connecter')
    }
}

module.exports.verifyUser = (req, res, next) => {
    console.log(req.user)
    this.verifyToken(req, res, () => {

        if (req.user.id === req.params.id 
            || 
            req.user.isAdmin 
            ||
            req.user.id === req.headers.user_id) {
            next();
        } else {
            return res.status(403).send("Vous n'etes pas autorisé à effectuer cette action")
        }
    })
}

module.exports.verifyAdmin = (req, res, next) => {

    this.verifyToken(req, res, () => {
        if(req.user.isAdmin === true){
            next()
        }else{
            res.status(403).send('Vous devez être admin pour ça')
        }
    })
}