const {v4 : uuidv4} = require('uuid')
const db = require('../config/db')

const getAllUsers = (query)=>{
    return new Promise((resolve, reject)=>{
        const {page = 1, limit = 3} = query
        const offset = (Number(page) -1 ) * Number(limit)
        db.query('SELECT id, displayname, phone, email from users LIMIT $1 OFFSET $2', [Number(limit), offset])
        .then((result)=>{
            const response = {
                limit,
                total : result.rowCount,
                data : result.rows
            }
            resolve(response)
        }).catch((err)=>{
            reject(err)
        })
    })
}

const getDetailUser = (id)=>{
    return new Promise((resolve, reject)=>{
        const sqlQuery = 'SELECT id, displayname, phone, email, photo FROM users WHERE id = $1'
        db.query(sqlQuery, [id])
        .then((result)=>{
            const response = {
                data : result.rows,
                err : null
            }
            resolve(response)
        })
        .catch((err)=>{
            console.log(err);
            reject(err)
        })
    })
}

const SignUp = (body, hashPassword)=>{
    return new Promise((resolve, reject)=>{
        const id = uuidv4()
        const timeStamp = new Date(Date.now())
        const { displayname, email, phone} = body
        const sqlQuery = "INSERT INTO users (id, displayname, email, password, phone, created_at) VALUES($1, $2, $3, $4, $5, $6) RETURNING displayname, email, phone"
        db.query(sqlQuery, [id, displayname, email, hashPassword, phone, timeStamp])
        .then((result)=>{
            const response = {
                data : result.rows,
                err : null
            }
            resolve(response)
        }).catch((err)=>{
            reject(err)
        })
    })
}

const getUserByEmail = (email)=>{
    return new Promise((resolve, reject)=>{
        const sqlQuery = "SELECT * FROM users WHERE email = $1"
        db.query(sqlQuery, [email]).then((result)=>{
            resolve(result)
        }).catch((err)=>{
            reject(err)
        })
    })
}

const getPassByEmail = async(email)=>{
    try {
        const result = await db.query('SELECT id, displayname, password FROM users WHERE email = $1', [email])
        if(result.rowCount === 0) throw {status : 400, err : {msg : "email is not registered"}}
        return result.rows[0]
    } catch (error) {
        throw {error}
    }
}

const editUser = (id, body)=>{
    return new Promise((resolve, reject)=>{
        const {displayname, phone, email, photo, firstname, lastname, birthday, gender} = body
        const sqlQuery = "UPDATE users SET displayname = COALESCE(NULLIF($2, ''), displayname), phone = COALESCE(NULLIF($3, '')::integer, phone),  email = COALESCE(NULLIF($4, ''), email), photo = COALESCE(NULLIF($5, ''), photo), firstname = COALESCE(NULLIF($6, ''), firstname), lastname = COALESCE(NULLIF($7, ''), lastname), birthday = COALESCE(NULLIF($8, '')::date, birthday), gender = COALESCE(NULLIF($9, ''), gender)  WHERE id = $1 RETURNING displayname, phone, email, photo, firstname, lastname, birthday, gender"
        db.query(sqlQuery, [id, displayname, phone, email, photo, firstname, lastname, birthday, gender])
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

const deleteUser = (id)=>{
    return new Promise((resolve, reject)=>{
        const sqlQuery = "DELETE FROM users WHERE id = $1 RETURNING displayname, phone, email, photo"
        db.query(sqlQuery, [id])
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
module.exports = {
    getAllUsers,
    getDetailUser,
    SignUp,
    editUser,
    deleteUser,
    getUserByEmail,
    getPassByEmail
}