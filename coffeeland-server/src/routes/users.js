const express = require('express')
const Router = express.Router()

const userController = require('../controllers/users')
const {verifyToken, chekDuplicateEmail, verifyTokenAmdin} = require('../middleware/auth')
const {uploadUsers} = require('../middleware/upload')

Router.get('/all', verifyTokenAmdin, userController.getAllUser)
Router.get('/', verifyToken, userController.getDetailUserController)
Router.post('/signup', chekDuplicateEmail, uploadUsers.single('photo'), userController.Register )
// Router.patch('/', verifyToken, userController.updateUser)
Router.delete('/', verifyTokenAmdin, userController.deleteSingleUser)
Router.patch('/', verifyToken, uploadUsers.single('photo'), userController.editUserUpload)
module.exports = Router