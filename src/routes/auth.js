const express = require('express')
const Router = express.Router()

const authController = require('../controllers/auth')
const {chekDuplicateEmail, verifyToken} = require('../middleware/auth')

Router.post('/login', authController.Login)
Router.post('/register', chekDuplicateEmail , authController.Register)
Router.delete('/logout', verifyToken, authController.Logout)
Router.post('/forgot', authController.ForgotPassword)
// (req,res)=>{
//     req._
// }

module.exports = Router