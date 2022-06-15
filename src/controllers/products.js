const productModels = require('../models/products')
const {getAllProduct, getSingleProduct, createProduct, updateProduct, deleteProduct, searchProduct, favoritProduct} = productModels
const {succesResponse, errorResponse} = require('../helpers/response')
const {db} = require('../config/db')
// const fs = require('fs')

const getFavoritProduct = async (req, res)=>{
    try {
        const result = await favoritProduct(req.query)
        const totalData = await db.query("SELECT count(*) FROM products INNER JOIN transactions ON products.name = transactions.product_name group by products.name")
        const limit = result.limit 
        let curentPage = Number(req.query.page)
        if(!curentPage){
            curentPage = 1
        }
        const total_product = totalData.rowCount
        const path = req.path
        let nextPage = `/product${path}?page=${curentPage+1}`
        let previousPage = `/product${path}?page=${curentPage-1}`
        const totalpage = Math.ceil(Number(total_product)/Number(limit))
        console.log(totalpage);
        if(totalpage === curentPage) {
            nextPage = null
        }
        if(curentPage === 1 ){
            previousPage = null
        }
        const meta = {
            total_product,
            totalpage,
            curentPage,
            nextPage,
            previousPage,
        }
        res.status(200).json({
            msg : "Show favorit product",
            data : result.data,
            meta
        })
        // succesResponse(res, 400, "Show favorit product", result, total_product)
    } catch (error) {
        console.log(error);
        errorResponse(res, 400, "Cannot get product", error)
    }
    // favoritProduct(req.query).then((result)=>{
    //     res.status(200).json({
    //         total : result.total,
    //         data : result.data,
    //         err : null
    //     })
    // }).catch((err)=>{
    //     res.status(400).json({
    //         err,
    //         data : []
    //     })
    // })
}

const findProduct = async (req, res) =>{
    try {

        const result = await searchProduct(req.query)
        const {total, limit, data} = result
        let magic = ''
        if(req.query){
            magic += req._parsedUrl.search
        }
        const searchName = req.query.name
        // const totalSearch =  await db.query("select count(*) as total_data from products where lower(name) like lower ('%' || $1 || '%')", [searchName])
        
        const totalProduct = Number(total)
        const totalPage = Math.ceil(totalProduct/Number(limit))
        const {page} = req.query
        let curentPage = Number(page)
        if(!curentPage){
            curentPage = 1
        }
        const pageNext = curentPage + 1
        const pagePrev = curentPage - 1
        let replaceMagicNext = magic.replace(`page=${curentPage}`, `page=${pageNext}`).replace('?', '&')
        const replaceMagicNextPrev = magic.replace(`page=${curentPage}`, `page=${pagePrev}`)
        // if(!magic){
        //     nextPage = `/product/?page=${curentPage + 1}`
        // }
        // console.log(replaceMagicNext);
        if(replaceMagicNext === 'null'){
            replaceMagicNext = ''
        }
        let nextPage = `/product/?page=${curentPage + 1}${replaceMagicNext}`
        let previousPage = `/product/${replaceMagicNextPrev}`
        if(curentPage === totalPage){
            nextPage = null
        }
        if(curentPage === 1){
            previousPage = null
        }
        const meta = {
            totalProduct,
            totalPage,
            curentPage,
            nextPage,
            previousPage,
        }
        res.status(200).json({
            msg : `Result for search ${searchName}`,
            meta,
            data
        })
        // succesResponse(res, 200, `Result for search ${searchName}`, result.data)
    } catch (error) {
        console.log(error);
        errorResponse(res, 400, "Cannot find product", error)
    }
    // searchProduct(req.query).then((result)=>{
    //     res.status(200).json({
    //         total : result.total,
    //         data : result.data,
    //         err : null
    //     })
    // }).catch((err)=>{
    //     res.status(400).json({
    //         err,
    //         data : null
    //     })
    // })
}

const getAllProducts = async (req, res)=>{
    try {
        const result = await getAllProduct(req.query)
        const data = await db.query("select count(*) as total_product from products")
        const limit = result.limit 
        let curentPage = Number(req.query.page)
        if(!curentPage){
            curentPage = 1
        }
        const path = req.path
        let nextPage = `/product${path}?page=${curentPage+1}`
        let previousPage = `/product${path}?page=${curentPage-1}`
        const {total_product} = data.rows[0]
        const totalpage = Math.ceil(Number(total_product)/Number(limit))
        if(totalpage === curentPage) {
            nextPage = null
        }
        if(curentPage === 1 ){
            previousPage = null
        }
        const meta = {
            totalpage,
            curentPage,
            nextPage,
            previousPage,
        }
        res.status(200).json({
            msg : "Show all product",
            total_product : Number(total_product),
            data : result.data,
            meta
        })

    } catch (error) {
        errorResponse(res, 400, 'Cannot get All product', error)    
    }
}
const getProductById = (req, res)=>{
    const id = req.params.id
    getSingleProduct(id)
    .then((result)=>{
        if(!result.data) return res.status(404).json({
            msg : "Data not found!!!"
        })
        res.status(200).json({
            msg : `Show data with id ${id}`,
            data : result.data[0],
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

const insertProduct = async (req, res)=>{
    try {
        const {file = null} = req
        const result = await createProduct(req.body, file)
        succesResponse(res, 200, "Proudct created", result.data)
    } catch (error) {
        console.log(req.file);
        errorResponse(res, 400, 'Cannot create product', error)
        console.log(error);
    }
    // createProduct(req.body).then((result)=>{
    // succesResponse(res, 200, "Proudct created", result.data)
    // }).catch((err)=>{
    //     errorResponse(res, 400, "Failed to create product", {err})
    // })
}
const editProduct = (req, res)=>{
    const id = req.params.id
    const body = req.body
    const {file = null} = req
    updateProduct(id, file,  body).then((result)=>{
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