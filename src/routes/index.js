const express = require('express')
const Router = express.Router()

const userRouter = require('./users')
const productRouter = require('./products')
const transactionsRouter = require('./transactions')
const promotionRouter = require('./promotions')
const authRouter = require('./auth')
const historyRouter = require('./history')


Router.get('/' , (req, res)=>{
    res.json({msg : "Wellcome to coffeland"})
})
Router.use('/user', userRouter)
Router.use('/product', productRouter)
Router.use('/transaction', transactionsRouter)
Router.use('/promo', promotionRouter)
Router.use('/auth', authRouter)
Router.use('/history', historyRouter)

module.exports = Router