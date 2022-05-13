const productModels = require('../models/products')
const {getAllProduct, getSingleProduct, createProduct, updateProduct, deleteProduct, searchProduct, favoritProduct} = productModels
const {succesResponse, errorResponse} = require('../helpers/response')
const db = require('../config/db')

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

const findProduct = async (req, res) =>{
    try {
        const result = await searchProduct(req.query)
        const searchName = req.query.name
        const dataProduct = result.data
        const totalSearch =  await db.query("select count(*) as total_data from products where lower(name) like lower ('%' || $1 || '%')", [searchName])
        const limit = result.limit
        const {total_data} = totalSearch.rows[0]
        const totalProduct = Number(total_data)
        const totalPage = Math.ceil(totalProduct/Number(limit))
        const {page} = req.query
        let curentPage = Number(page)
        if(curentPage === 0){
            curentPage = 1
        }
        const magic = req._parsedUrl.search
        const pageNext = curentPage + 1
        const pagePrev = curentPage - 1
        console.log(magic);
        const replaceMagicNext = magic.replace(`page=${curentPage}`, `page=${pageNext}`)
        const replaceMagicNextPrev = magic.replace(`page=${curentPage}`, `page=${pagePrev}`)
        console.log(curentPage);
        console.log(replaceMagicNext);
        let nextPage = `/product/${replaceMagicNext}`
        let previousPage = `/product/${replaceMagicNextPrev}`
        if(curentPage === totalPage){
            nextPage = `This is the last page`
        }
        if(curentPage === 1){
            previousPage = `This is the first page`
        }
        res.status(200).json({
            msg : `Result for search ${searchName}`,
            totalProduct,
            totalPage,
            curentPage,
            nextPage,
            previousPage,
            dataProduct,
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
        if(curentPage === 0){
            curentPage = 1
        }
        const path = req.path
        let nextPage = `/product${path}?page=${curentPage+1}`
        let previousPage = `/product${path}?page=${curentPage-1}`
        const {total_product} = data.rows[0]
        const totalpage = Math.ceil(Number(total_product)/Number(limit))
        if(totalpage === curentPage) {
            nextPage = `This is the last page`
        }
        if(curentPage === 1 ){
            previousPage = `This is the first page`
        }
        res.status(200).json({
            msg : "Show all product",
            total_product : Number(total_product),
            totalpage,
            curentPage,
            nextPage,
            previousPage,
            data : result.data
        })
    } catch (error) {
        errorResponse(res, 400, 'Cannot get All product', error)    
    }
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