const db = require('../config/db')

const getAllUsers = ()=>{
    return new Promise((resolve, reject)=>{
        db.query('SELECT id, displayname, phone, email from users')
        .then((result)=>{
            const response = {
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

const SignUp = (body)=>{
    return new Promise((resolve, reject)=>{
        const { displayname, email, password, phone} = body
        const sqlQuery = "INSERT INTO users (displayname, email, password, phone) VALUES($1, $2, $3, $4) RETURNING displayname, email, phone"
        db.query(sqlQuery, [displayname, email, password, phone])
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
    deleteUser
}