const express = require('express')
const Router = express.Router()

const authController = require('../controllers/auth')
const {chekDuplicateEmail} = require('../middleware/auth')

Router.post('/login', authController.Login)
Router.post('/register', chekDuplicateEmail , authController.Register)
Router.patch('/logout', authController.Logout)
// (req,res)=>{
//     req._
// }

module.exports = Router