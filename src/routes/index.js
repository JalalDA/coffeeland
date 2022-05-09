const express = require('express')
const Router = express.Router()

const userRouter = require('./users')
const productRouter = require('./products')
const transactionsRouter = require('./transactions')
const promotionRouter = require('./promotions')

Router.use('/user', userRouter)
Router.use('/product', productRouter)
Router.use('/transaction', transactionsRouter)
Router.use('/promo', promotionRouter)
module.exports = Router