const express = require('express')
const Router = express.Router()

const productController = require('../controllers/products')
const validate = require('../middleware/validate')

Router.get('/favorit', productController.getFavoritProduct)
Router.get('/', validate.findProduct, productController.findProduct)
Router.get('/all', productController.getAllProducts)
Router.get('/:id', productController.getProductById)
Router.post('/', productController.insertProduct)
Router.patch('/:id', productController.editProduct)
Router.delete('/:id', productController.deleteProducts)

module.exports = Router