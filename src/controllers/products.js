const productModels = require('../models/products')
const {getAllProduct, getSingleProduct, createProduct, updateProduct, deleteProduct, searchProduct, favoritProduct} = productModels
const {succesResponse, errorResponse} = require('../helpers/response')

const getFavoritProduct = (req, res)=>{
    favoritProduct().then((result)=>{
        res.status(200).json({
            total : result.total,
            data : result.data,
            err : null
        })
    }).catch((err)=>{
        res.status(400).json({
            err,
            data : []
        })
    })
}

const findProduct = (req, res) =>{
    searchProduct(req.query).then((result)=>{
        res.status(200).json({
            total : result.total,
            data : result.data,
            err : null
        })
    }).catch((err)=>{
        res.status(400).json({
            err,
            data : null
        })
    })
}

const getAllProducts = (req, res)=>{
    getAllProduct(req.query).then((result)=>{
        succesResponse(res, 200, 'Show All Product', result.data, result.total)
        // res.status(200).json({
        //     data : result.data,
        //     err : null
        // })
    }).catch((err)=>{
        errorResponse(res, 400, 'Cannot get All product', err)
        // res.status(400).json({
        //     data : [], 
        //     err
        // })
    })
}

const getProductById = (req, res)=>{
    getSingleProduct(req.params.id)
    .then((result)=>{
        if(!result.data) return res.status(404).json({
            msg : "Data not found!!!"
        })
        res.status(200).json({
            data : result.data,
            err : null
        })
    })
    .catch((err)=>{
        res.status(400).json({
            data : [],
            err
        })
    })
}

const insertProduct = (req, res)=>{
    createProduct(req.body).then((result)=>{
        succesResponse(res, 200, "Proudct created", result.data)
        // res.status(200).json({
        //     msg : "Product created",
        //     data : result.data,
        //     err : null
        // })
    }).catch((err)=>{
        errorResponse(res, 400, "Failed to create product", {err})
    })
}
const editProduct = (req, res)=>{
    const id = req.params.id
    const body = req.body
    updateProduct(id, body).then((result)=>{
        res.status(200).json({
            data : result.data,
            err : null
        })
    }).catch((err)=>{
        res.status(400).json({
            data : [],
            err
        })
    })
}

const deleteProducts = (req, res)=>{
    const id = req.params.id
    deleteProduct(id).then((result)=>{
        res.status(200).json({
            msg : "Product has been deleted",
            data : result.data,
            err : null
        })
    }).catch((err)=>{
        res.status(400).json({
            data : [],
            err
        })
    })
}
module.exports = {
    getAllProducts,
    getProductById,
    insertProduct,
    editProduct,
    deleteProducts,
    findProduct,
    getFavoritProduct
}