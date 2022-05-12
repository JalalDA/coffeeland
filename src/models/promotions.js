const db = require('../config/db')
const {v4 : uuidv4} = require('uuid')

const getAllPromotion = (query)=>{
    return new Promise((resolve, reject)=>{
        const {page =1, limit = 3} = query
        const offset = (Number(page)-1) * Number(limit)
        db.query("SELECT * FROM promotions LIMIT $1 OFFSET $2", [limit, offset]).then((result)=>{
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
        const id = uuidv4()
        const {code, expiredtime, starttime, discount} = body
        const sqlQuery = "INSERT INTO promotions(id, code, expiredtime, starttime, discount) VALUES ($1, $2, $3, $4, $5) RETURNING *"
        db.query(sqlQuery, [id, code, expiredtime, starttime, discount])
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