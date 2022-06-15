const express = require('express')
const Router = express.Router()

const promoController = require('../controllers/promotions')
const {verifyTokenAmdin} = require('../middleware/auth')

Router.get('/all', promoController.getAllPromotions)
Router.get('/', promoController.searchPromoCode)
Router.post('/', verifyTokenAmdin, promoController.insertPromo)
Router.patch('/:id', verifyTokenAmdin, promoController.editPromo)
Router.delete('/:id', verifyTokenAmdin, promoController.deletePromoById)

module.exports = Router