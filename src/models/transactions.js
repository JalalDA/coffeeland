const db = require('../config/db')
const {v4 : uuidv4} = require('uuid')

const getAllTransaction = (query)=>{
    return new Promise((resolve, reject)=>{
        let {page, limit} = query
        if(!page) {page = 1}
        if(!limit) {limit = 2}
        const offset = (Number(page)-1) * Number(limit)
        db.query("SELECT * FROM transactions LIMIT $1 OFFSET $2 RETURNING *", [limit, offset]).then((result)=>{
            const response = {
                limit,
                total : result.rowCount,
                data : result.rows,
                err : null
            }
            resolve(response)
        }).catch((err)=>{
            reject(err)
        })
    })
}

const getSingelTransaction = (id)=>{
    return new Promise((resolve, reject)=>{
        const sqlQuery = "SELECT * FROM transactions WHERE id = $1"
        db.query(sqlQuery, [id]).then((result)=>{
            const response = {
                data : result.rows,
                err : null
            }
            resolve(response)
        }).catch((err)=>{
            console.log(err);
            reject(err)
        })
    })
}

const createTransaction = (body)=>{
    return new Promise ((resolve, reject)=>{
        const id = uuidv4()
        const {product_name, user_name, address, time_transaction, promo_code, delivery_cost, tax, total_payment, paymentmethod, delivery_method } = body
        const sqlQuery = "INSERT INTO transactions(id, product_name, user_name, address, time_transaction, promo_code, delivery_cost, tax, total_payment, paymentmethod, delivery_method) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *"
        const arr = [id, product_name, user_name, address, time_transaction, promo_code, delivery_cost, tax, total_payment, paymentmethod, delivery_method]
        db.query(sqlQuery, arr)
        .then((result)=>{
            const response = {
                data : result.rows,
                err : null
            }
            resolve(response)
        }).catch((err)=>{
            console.log(err);
            reject(err)
        })
    })
}

const updateTransaction = (id, body)=>{
    return new Promise((resolve, reject)=>{
        const {product_name, user_name, address, time_transaction, promo_code, delivery_cost, tax, total_payment, paymentmethod, delivery_method } = body
        const arr = [id, product_name, user_name, address, time_transaction, promo_code, delivery_cost, tax, total_payment, paymentmethod, delivery_method]
        const sqlQuery = "UPDATE transactions SET product_name = COALESCE(NULLIF($2, ''), product_name), user_name = COALESCE(NULLIF($3, ''), user_name),  address = COALESCE(NULLIF($4, ''), address), time_transaction = COALESCE(NULLIF($5, '')::timestamp, time_transaction), promo_code = COALESCE(NULLIF($6, ''), promo_code), delivery_cost = COALESCE(NULLIF($7, ''), delivery_cost), tax = COALESCE(NULLIF($8, ''), tax), total_payment = COALESCE(NULLIF($9, ''), total_payment), paymentmethod = COALESCE(NULLIF($10, ''), paymentmethod), delivery_method = COALESCE(NULLIF($11, ''), delivery_method) WHERE id = $1 RETURNING *"
        db.query(sqlQuery, arr)
        .then((result)=>{
            const response = {
                data : result.rows,
                err : null
            }
            resolve(response)
        })
        .catch((err)=>{
            reject(err)
        })
    })
}

const deleteTransaction = (id)=>{
    return new Promise((resolve, reject)=>{
        const sqlQuery = "DELETE FROM transactions WHERE id = $1 RETURNING *"
        db.query(sqlQuery, [id])
        .then((result)=>{
            const response = {
                msg : `Data with id = ${id} has been deleted`,
                data : result.rows,
                err : null
            }
            resolve(response)
        })
        .catch((err)=>{
            reject(err)
        })
    })
}

module.exports = {
    getAllTransaction,
    createTransaction,
    updateTransaction,
    getSingelTransaction,
    deleteTransaction
}