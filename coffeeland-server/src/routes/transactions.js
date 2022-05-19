const express = require('express')
const Router = express.Router()

const transactionController = require('../controllers/transactions')
const {verifyTokenAmdin, verifyToken} = require('../middleware/auth')

Router.get('/all', verifyTokenAmdin, transactionController.getAllTransactions)
Router.get('/:id', verifyToken, transactionController.getDetailTransaction)
Router.post('/', verifyToken, transactionController.insertTransaction)
Router.patch('/:id', verifyToken, transactionController.editTransaction)
Router.delete('/:id', verifyTokenAmdin, transactionController.deleteTransactionById)

module.exports = Router