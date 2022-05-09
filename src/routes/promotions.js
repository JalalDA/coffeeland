const express = require('express')
const Router = express.Router()

const promoController = require('../controllers/promotions')

Router.get('/all', promoController.getAllPromotions)
Router.get('/', promoController.searchPromoCode)
Router.post('/', promoController.insertPromo)
Router.patch('/:id', promoController.editPromo)
Router.delete('/:id', promoController.deletePromoById)

module.exports = Router