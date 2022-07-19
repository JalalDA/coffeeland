const {v4 : uuidv4} = require('uuid')
const {db} = require('../config/db')

const updateUserUpload = (id, file, body )=>{
    return new Promise((resolve, reject)=>{
        const {display_name, phone, email, firstname, lastname, birthday, gender, delivery_adress} = body
        // let photo = file? file.path.replace('public', '').replace(/\\/g, '/') : null
        const photo = file? file.path : null
        const updated_at = new Date(Date.now())
        const sqlQuery = "UPDATE users SET display_name = COALESCE(NULLIF($2, ''), display_name), phone = COALESCE(NULLIF($3, '')::integer, phone),  email = COALESCE(NULLIF($4, ''), email), photo = COALESCE(NULLIF($5, ''), photo), firstname = COALESCE(NULLIF($6, ''), firstname), lastname = COALESCE(NULLIF($7, ''), lastname), birthday = COALESCE(NULLIF($8, '')::date, birthday), gender = COALESCE(NULLIF($9, ''), gender), updated_at = COALESCE(NULLIF($10, '')::timestamp, updated_at), delivery_adress = COALESCE(NULLIF($11, ''), delivery_adress)  WHERE id = $1 RETURNING display_name, phone, email, photo, firstname, lastname, birthday, gender, updated_at, delivery_adress"
        db.query(sqlQuery, [id, display_name, phone, email, photo, firstname, lastname, birthday, gender, updated_at, delivery_adress]).then((result)=>{
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
        const sqlQuery = 'SELECT id, display_name, phone, email, photo, firstname, lastname, birthday, gender, delivery_adress FROM users WHERE id = $1'
        db.query(sqlQuery, [id])
        .then((result)=>{
            console.log(result);
            const response = {
                data : result.rows[0],
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
        const { email, phone} = body
        const sqlQuery = "INSERT INTO users (id, email, password, phone) VALUES($1, $2, $3, $4) RETURNING email, phone"
        db.query(sqlQuery, [id, email, hashPassword, phone])
        .then((result)=>{
            const response = {
                data : result.rows[0],
                err : null
            }
            resolve(response)
        }).catch((err)=>{
            console.log(err);
            reject(err)
        })
    })
}

const createUser = (body, hashPassword)=>{
    return new Promise((resolve, reject)=>{
        const id = uuidv4()
        const { display_name, email, phone} = body
        const sqlQuery = "INSERT INTO users (id, display_name, email, password, phone) VALUES($1, $2, $3, $4, $5) RETURNING email, phone"
        db.query(sqlQuery, [id, display_name, email, hashPassword, phone])
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

const updatePass = (password, email)=>{
    return new Promise((resolve, reject)=>{
        const sqlQery = "UPDATE set password = $1 where email = $2"
        db.query(sqlQery, [password, email])
        .then(result=>{
            resolve(result)
        })
        .catch(err=>{
            reject(err)
        })
    })
}

const getPassByEmail = async(email)=>{
    try {
        const result = await db.query('SELECT id, display_name, password, photo, role FROM users WHERE email = $1', [email])
        if(result.rowCount === 0) throw {status : 400, err : {msg : "email is not registered"}}
        return result.rows[0]
    } catch (error) {
        throw {error}
    }
}


const editUser = (id, file, body)=>{
    return new Promise((resolve, reject)=>{
        const photo = file? file.path : null
        const {display_name, phone, email, firstname, lastname, birthday, gender} = body
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
    updateUserUpload,
    createUser,
    updatePass
}