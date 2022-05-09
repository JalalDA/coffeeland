const express = require('express')
const Router = express.Router()

const transactionController = require('../controllers/transactions')

Router.get('/all', transactionController.getAllTransactions)
Router.get('/:id', transactionController.getDetailTransaction)
Router.post('/', transactionController.insertTransaction)
Router.patch('/:id', transactionController.editTransaction)
Router.delete('/:id', transactionController.deleteTransactionById)

module.exports = Router