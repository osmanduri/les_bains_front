const router = require('express').Router()
const userController = require('../Controllers/userController')
const verify = require('./utils/verifyToken')

router.get('/getAllUsers', verify.verifyToken ,userController.getAllClient)
router.post('/getAllFilter', verify.verifyToken,userController.getAllClientParPage);
router.get('/getUserById/:id', verify.verifyToken, userController.getAllClientById)
router.post('/addUser', verify.verifyToken, userController.addClient)
router.put('/updateClient/:id', verify.verifyToken, userController.updateClient)
router.delete('/deleteClient/:id', verify.verifyToken, userController.deleteClientById)
router.post('/addAdmin', userController.addAdmin)
router.get('/getAdminById/:id',verify.verifyToken, userController.getAdminById)
router.get('/verifyConnected', verify.verifyToken, userController.verifyConnected)
router.get('/verifyIdentify', verify.verifyToken, userController.verifyIsUserOrAdmin)

router.post('/login', userController.login)
router.post('/searchByPhoneNumber', verify.verifyToken, userController.rechercheParNumeroDeTel)
router.get('/entrance/:id', verify.verifyToken, userController.entrance)
router.get('/cookie', userController.setCookies)

module.exports = router;

