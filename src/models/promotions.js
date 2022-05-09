const db = require('../config/db')

const getAllPromotion = ()=>{
    return new Promise((resolve, reject)=>{
        db.query("SELECT * FROM promotions").then((result)=>{
            const response = {
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

const searchPromo = (query)=>{
    return new Promise((resolve, reject)=>{
        const {code} = query
        const sqlQuery = "select * from promotions where lower (code) like lower ('%' || $1 || '%')"
        db.query(sqlQuery, [code]).then((result)=>{
            const response = {
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

const createPromo = (body)=>{
    return new Promise((resolve, reject)=>{
        const {code, expiredtime, starttime, discount} = body
        const sqlQuery = "INSERT INTO promotions(code, expiredtime, starttime, discount) VALUES ($1, $2, $3, $4) RETURNING *"
        db.query(sqlQuery, [code, expiredtime, starttime, discount])
        .then((result)=>{
            const response = {
                msg : "promo has been created",
                data : result.rows,
                err : null
            }
            resolve(response)
        }).catch((err)=>{
            reject(err)
        })

    })
}

const updatePromo = (id, body)=>{
    return new Promise((resolve, reject)=>{
        const {code, expiredtime, starttime, discount} = body
        const arr = [id, code, expiredtime, starttime, discount]
        const sqlQuery = "UPDATE promotions SET code = COALESCE(NULLIF($2, ''), code), expiredtime = COALESCE(NULLIF($3, '')::timestamp, expiredtime),  starttime = COALESCE(NULLIF($4, '')::timestamp, starttime), discount = COALESCE(NULLIF($5, ''), discount) WHERE id = $1 RETURNING *"
        db.query(sqlQuery, arr)
        .then((result)=>{
            const response = {
                msg : `Data with id = ${id}, has been updated`,
                data : result.rows,
                err : null
            }
            resolve(response)
        }).catch((err)=>{
            reject(err)
        })
    })
}

const deletePromo = (id)=>{
    return new Promise((resolve, reject)=>{
        const sqlQuery = "DELETE FROM promotions WHERE id = $1 RETURNING *"
        db.query(sqlQuery, [id]).then((result)=>{
            const response = {
                msg : `Promo with id = ${id} has been deleted`,
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

module.exports = {
    getAllPromotion,
    searchPromo,
    createPromo,
    updatePromo,
    deletePromo
}