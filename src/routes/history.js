const express = require('express')
const Router = express.Router()
const {verifyToken} = require('../middleware/auth')
const {getHistoryTransaction, deleteHistoryTransaction} = require('../controllers/history')

Router.get('/', verifyToken, getHistoryTransaction)
Router.patch('/delete', deleteHistoryTransaction)

module.exports = Router