const express = require('express')
const Router = express.Router()

const userController = require('../controllers/users')

Router.get('/all', userController.getAllUser)
Router.get('/:id', userController.getDetailUserController)
Router.post('/signup', userController.Register )
Router.post('/login', userController.Login)
Router.patch('/:id', userController.updateUser)
Router.delete('/:id', userController.deleteSingleUser)

module.exports = Router