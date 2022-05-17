const {v4 : uuidv4} = require('uuid')
const {db} = require('../config/db')

const updateUserUpload = (id, file, body )=>{
    return new Promise((resolve, reject)=>{
        const {display_name, phone, email, firstname, lastname, birthday, gender} = body
        let photo = file? file.path.replace('public', '').replace(/\\/g, '/') : null
        const updated_at = new Date(Date.now())
        const sqlQuery = "UPDATE users SET display_name = COALESCE(NULLIF($2, ''), display_name), phone = COALESCE(NULLIF($3, '')::integer, phone),  email = COALESCE(NULLIF($4, ''), email), photo = COALESCE(NULLIF($5, ''), photo), firstname = COALESCE(NULLIF($6, ''), firstname), lastname = COALESCE(NULLIF($7, ''), lastname), birthday = COALESCE(NULLIF($8, '')::date, birthday), gender = COALESCE(NULLIF($9, ''), gender), updated_at = COALESCE(NULLIF($10, '')::timestamp, updated_at)  WHERE id = $1 RETURNING display_name, phone, email, photo, firstname, lastname, birthday, gender, updated_at"
        db.query(sqlQuery, [id, display_name, phone, email, photo, firstname, lastname, birthday, gender, updated_at]).then((result)=>{
            console.log(photo);
            const response = {
                msg : "Update succes",
                data : result.rows[0]
            }
            resolve(response)
        }).catch((err)=>{
            reject(err)
            console.log(err);
        })
    })
}

const getAllUsers = (query)=>{
    return new Promise((resolve, reject)=>{
        let {page, limit} = query
        if(!page){page = 1}
        if(!limit){limit = 3}
        const offset = (Number(page) - 1 ) * Number(limit)
        db.query('SELECT id, display_name, phone, email from users LIMIT $1 OFFSET $2', [Number(limit), offset])
        .then((result)=>{
            console.log(offset);
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
        const sqlQuery = 'SELECT id, display_name, phone, email, photo FROM users WHERE id = $1'
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
        const { display_name, email, phone, role} = body
        const sqlQuery = "INSERT INTO users (id, display_name, email, password, phone, created_at, role) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING display_name, email, phone"
        db.query(sqlQuery, [id, display_name, email, hashPassword, phone, timeStamp, role])
        .then((result)=>{
            const response = {
                data : result.rows[0],
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
        const result = await db.query('SELECT id, display_name, password, role FROM users WHERE email = $1', [email])
        if(result.rowCount === 0) throw {status : 400, err : {msg : "email is not registered"}}
        return result.rows[0]
    } catch (error) {
        throw {error}
    }
}


const editUser = (id, body)=>{
    return new Promise((resolve, reject)=>{
        const {display_name, phone, email, photo, firstname, lastname, birthday, gender} = body
        const sqlQuery = "UPDATE users SET display_name = COALESCE(NULLIF($2, ''), display_name), phone = COALESCE(NULLIF($3, '')::integer, phone),  email = COALESCE(NULLIF($4, ''), email), photo = COALESCE(NULLIF($5, ''), photo), firstname = COALESCE(NULLIF($6, ''), firstname), lastname = COALESCE(NULLIF($7, ''), lastname), birthday = COALESCE(NULLIF($8, '')::date, birthday), gender = COALESCE(NULLIF($9, ''), gender)  WHERE id = $1 RETURNING displayname, phone, email, photo, firstname, lastname, birthday, gender"
        db.query(sqlQuery, [id, display_name, phone, email, photo, firstname, lastname, birthday, gender])
        .then((result)=>{
            console.log(id);
            console.log(result);
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
        const sqlQuery = "DELETE FROM users WHERE id = $1 RETURNING display_name, phone, email, photo"
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
    getPassByEmail,
    updateUserUpload
}