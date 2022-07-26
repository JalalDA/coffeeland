const {db} = require('../config/db')
const modelsTransaction = require('../models/transactions')
const {createPayment} = require('../config/midtrans')
const { messaging } = require('../config/firebase')
const notif = messaging()

const {
    getAllTransaction, 
    createTransaction, 
    updateTransaction, 
    getSingelTransaction, 
    deleteTransaction,
    getDailyReport,
} = modelsTransaction

const getDailyRevenue = async (req, res)=>{
    try {
        const result = await getDailyReport()
        res.status(200).json({
            data : result.data,
            msg : result.msg
        })
    } catch (error) {
        res.status(400).json({
            msg : `Cannot get report`,
            data : error
        })
    }
}

const getAllTransactions = async (req, res)=>{
    try {
        const result = await getAllTransaction(req.query)
        const limit = result.limit
        const totalData = await db.query("select count(*) as total_transaction from transactions")
        const {total_transaction} = totalData.rows[0]
        const totalTransaction = Number(total_transaction)
        const totalPage = Math.ceil(totalTransaction/Number(limit))
        let curentPage =Number(req.query.page) 
        if(!curentPage)  {curentPage =1}
        let nextPage = `/transaction/all?page=${curentPage + 1}&limit=${limit}`
        if(curentPage === totalPage){nextPage=`This is the last page`}
        let previousPage = `/transaction/all?page=${curentPage - 1}&limit=${limit}`
        if(curentPage === 1){previousPage = `This is the first page`}
        res.status(200).json({
            msg : "Show all transaction",
            totalTransaction,
            totalPage,
            curentPage,
            nextPage,
            previousPage,
            data : result.data,
        })
    } catch (error) {
        console.log(error);
    }
    // getAllTransaction().then((result)=>{
    //     res.status(200).json({
    //         total : result.total,
    //         data : result.data,
    //         err : null
    //     })
    // }).catch((err)=>{
    //     res.status(400).json({
    //         err,
    //         data : []
    // //     })
    // })
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

let order_id 
const insertTransaction = (req, res)=>{
    const id = req.userPayload.id
    const user_name = req.userPayload.display_name
    const msg = {
        token : process.env.TOKEN_NOTIF, 
        notifications : {
            title : "New Transaction", 
            message : `User ${user_name} created new transaction`
        }
    }
    
    createTransaction(req.body, user_name, id).then((result)=>{
        notif.send(msg)
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
    deleteTransactionById,
    getDailyRevenue
}