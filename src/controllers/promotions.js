const modelPromotion = require('../models/promotions')
const {getAllPromotion, searchPromo, createPromo, updatePromo, deletePromo} = modelPromotion
const {succesResponse, errorResponse} = require('../helpers/response')
const db = require('../config/db')

const getAllPromotions = async (req, res)=>{
    try {
        const result = await getAllPromotion(req.query)
        const total = await db.query("select count(*) as total_promo from promotions")
        const {total_promo} = total.rows[0]
        const totalPromo = Number(total_promo)
        const limit = result.limit
        const totalPage = Math.ceil(Number(total_promo)/Number(limit))
        let curentPage = Number(req.query.page)
        if(!curentPage) {curentPage = 1}
        let nextPage = `/promo/all?page=${curentPage+ 1}`
        let previousPage =`/promo/all?page=${curentPage-1}`
        if(curentPage === totalPage){
            nextPage = "This is the last page"
        }
        if(curentPage === 1){
            previousPage = "This is the first page"
        }
        res.status(200).json({
            msg : "Show all promo",
            totalPromo,
            totalPage,
            curentPage,
            nextPage,
            previousPage,
            data : result.data
        })
    } catch (error) {
        errorResponse(res, 400, "Cannot get Data", error)
        console.log(error);
    }
    // .then((result)=>{
    //     succesResponse(res, 200, 'Show all promo', result.data, result.total)
    // }).catch((err)=>{
    //     errorResponse(res, 400, 'Cannot get all promo', err)
    //     // res.status(400).json({
    //     //     err,
    //     //     data : null
    //     // })
    // })
}

const searchPromoCode = async (req, res)=>{
    try {
        const result = await searchPromo(req.query)
        const code = result.code
        const limit = result.limit
        const totalSearch = await db.query("select count(*) as total_search from promotions where lower (code) like lower ('%' || $1 || '%')", [code])
        const {total_search} =totalSearch.rows[0]
        const total_promo = Number(total_search)
        console.log(total_promo);
        const totalPage = total_promo/Number(limit)
        let curentPage = Number(req.query.page)
        if(!curentPage){curentPage = 1}
        let nextPage = `/promo/?code=${code}&page=${curentPage + 1}&limit=${limit}`
        let previousPage = `/promo/?code=${code}&page=${curentPage - 1}&limit=${limit}`
        if(totalPage === curentPage){nextPage = "This is the last page"}
        if(curentPage === 1) {previousPage = "This is the first page"}
        const data = result.data
        res.status(200).json({
            msg : `Show result for search '${code}' `,
            total_promo,
            totalPage,
            curentPage,
            nextPage,
            previousPage,
            data
        })
        // succesResponse(res, 200, `Show result for search '${code}' `, total_search)
    } catch (error) {
        console.log(error);
    }
    // searchPromo(req.query).then((result)=>{
    //     succesResponse(res, 200, 'Show Promo Code', result.data, result.total)
    // }).catch((err)=>{
    //     res.status(400).json({
    //         err, 
    //         data : []
    //     })
    // })
}

const insertPromo = (req, res)=>{
    const body = req.body
    createPromo(body).then((result)=>{
        succesResponse(res, 200, result.msg, result.data)
        // res.status(200).json({
        //     msg : result.msg,
        //     data : result.data,
        //     err : result.err
        // })
    }).catch((err)=>{
        res.status(400).json({
            err,
            data : []
        })
    })
}

const editPromo = (req, res)=>{
    const id = req.params.id
    const body = req.body
    updatePromo(id, body)
    .then((result)=>{
        res.status(200).json({
            msg : result.msg, 
            data : result.data,
            err : result.err
        })
    })
    .catch((err)=>{
        res.status(400).json({
            err,
            data : []
        })
    })
}

const deletePromoById = (req, res)=>{
    const id = req.params.id
    deletePromo(id).then((result)=>{
        res.status(200).json({
            msg : result.msg,
            data : result.data,
            err : result.err
        })
    }).catch((err)=>{
        res.status(400).json({
            err,
            data : []
        })
    })
}

module.exports = {
    getAllPromotions,
    searchPromoCode,
    insertPromo,
    editPromo,
    deletePromoById
}