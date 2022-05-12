const modelPromotion = require('../models/promotions')
const {getAllPromotion, searchPromo, createPromo, updatePromo, deletePromo} = modelPromotion
const {succesResponse, errorResponse} = require('../helpers/response')

const getAllPromotions = (req, res)=>{
    getAllPromotion(req.query).then((result)=>{
        succesResponse(res, 200, 'Show all promo', result.data, result.total)
    }).catch((err)=>{
        errorResponse(res, 400, 'Cannot get all promo', err)
        // res.status(400).json({
        //     err,
        //     data : null
        // })
    })
}

const searchPromoCode = (req, res)=>{
    searchPromo(req.query).then((result)=>{
        succesResponse(res, 200, 'Show Promo Code', result.data, result.total)
    }).catch((err)=>{
        res.status(400).json({
            err, 
            data : []
        })
    })
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