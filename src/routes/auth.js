const express = require('express')
const Router = express.Router()

const authController = require('../controllers/auth')
const {chekDuplicateEmail, verifyToken} = require('../middleware/auth')

Router.post('/login', authController.Login)
Router.post('/register', chekDuplicateEmail , authController.Register)
Router.delete('/logout', verifyToken, authController.Logout)
Router.post('/forgot', authController.ForgotPassword)
Router.put('/reset', authController.resetPassword)
Router.delete('/token', authController.deletetoken)
Router.patch('/editpass', authController.editPass)
// (req,res)=>{
//     req._
// }

module.exports = Router