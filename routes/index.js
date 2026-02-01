const express = require('express')
const router = express.Router()

const registerController = require('../controllers/RegisterController')
const loginController = require('../controllers/LoginController')
const userController = require('../controllers/UserController')
const { validateRegister, validateLogin } = require('../utils/validators/auth')
const { validateUser } = require('../utils/validators/user')
const verifyToken = require('../middlewares/auth')

router.post('/register', validateRegister, registerController.register)
router.post('/login', validateLogin, loginController.login)

router.get('/users', verifyToken, userController.findUsers)
router.post('/user', verifyToken, validateUser, userController.createUser)
router.put('/user/:id', verifyToken, validateUser, userController.updateUser)
router.delete('/user/:id', verifyToken, userController.deleteUser)
router.get('/user/:id', verifyToken, userController.findUserById)

module.exports = router
