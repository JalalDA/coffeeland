const {db} = require('../config/db')

const getHistory = (user_id)=>{
        return new Promise((resolve, reject)=>{
            db.query("select transactions.id, product_name, product_image, total_payment from transactions inner join users on transactions.user_id = users.id where user_id = $1 and deleted_at is null group by transactions.id, transactions.product_name, transactions.product_image, transactions.total_payment", [user_id])
            .then((result)=>{
                const response = {
                    data : result.rows,
                    total : result.rowCount
                }
                resolve(response)
            })
            .catch((err)=>{
                reject(err)
                console.log(err);
            })
        })
}

const deleteHistory = (body)=>{
    const {idProduct} = body
    console.log(idProduct);
    return new Promise((resolve, reject)=>{
        db.query(`update transactions set deleted_at = now() where id = $1`, [idProduct])
        .then(result=>{
            const response = {
                data : result.rows,
                total : result.rowCount
            }
            resolve(response)
        })
        .catch(err=>{
            reject(err)
        })
    })

}

module.exports = {getHistory, deleteHistory}