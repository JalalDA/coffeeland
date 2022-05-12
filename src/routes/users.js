const express = require('express')
const Router = express.Router()

const userController = require('../controllers/users')
const {verifyToken, chekDuplicateEmail} = require('../middleware/auth')

Router.get('/all', verifyToken, userController.getAllUser)
Router.get('/:id', userController.getDetailUserController)
Router.post('/signup', chekDuplicateEmail,userController.Register )
Router.patch('/:id', userController.updateUser)
Router.delete('/:id', userController.deleteSingleUser)

module.exports = Router