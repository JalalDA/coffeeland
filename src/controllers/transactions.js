const modelsTransaction = require('../models/transactions')
const {getAllTransaction, createTransaction, updateTransaction, getSingelTransaction, deleteTransaction} = modelsTransaction


const getAllTransactions = (req, res)=>{
    getAllTransaction().then((result)=>{
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

const getDetailTransaction = (req, res) =>{
    getSingelTransaction(req.params.id).then((result)=>{
        res.status(200).json({
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

const insertTransaction = (req, res)=>{
    createTransaction(req.body).then((result)=>{
        res.status(200).json({
            data : result.data,
            err : null
        })
    }).catch((err)=>{
        console.log(err);
        res.status(400).json({
            data : [],
            err
        })
    })
}

const editTransaction = (req, res)=>{
    const id = req.params.id
    const body = req.body
    updateTransaction(id, body).then((result)=>{
        res.status(200).json({
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

const deleteTransactionById = (req, res)=>{
    deleteTransaction(req.params.id).then((result)=>{
        res.status(200).json({
            msg : result.msg,
            data : result.data,
            err : result.err
        })
    }).catch((err)=>{
        res.status(400).json({
            data : [],
            err
        })
    })
}

module.exports ={
    getAllTransactions,
    insertTransaction,
    editTransaction,
    getDetailTransaction,
    deleteTransactionById
}