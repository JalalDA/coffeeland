const express = require('express')
const Router = express.Router()

const productController = require('../controllers/products')
const validate = require('../middleware/validate')
const {uploadProducts} = require('../middleware/upload')
const validateAuth = require('../middleware/auth')

Router.get('/favorit', productController.getFavoritProduct)
Router.get('/', productController.findProduct)
Router.get('/all', productController.getAllProducts)
Router.get('/:id', productController.getProductById)
Router.post('/', validateAuth.verifyTokenAmdin, uploadProducts.single('pictures'), productController.insertProduct)
Router.patch('/:id', validateAuth.verifyTokenAmdin, uploadProducts.single('pictures'), productController.editProduct)
Router.delete('/:id', validateAuth.verifyTokenAmdin, productController.deleteProducts)

module.exports = Router