const {v4 : uuidv4} = require('uuid')
const db = require('../config/db')

const favoritProduct = (query)=>{
    return new Promise((resolve, reject)=>{
        let {page, limit} = query
        if(!page) {page = 1}
        if(!limit) {limit = 3}
        const offset = (Number(page)-1) * Number(limit)
        const sqlQuery = "SELECT name, price, pictures, count(*) FROM products INNER JOIN transactions ON products.name = transactions.product_name group by products.name, products.price, products.pictures order by count(*) desc limit $1 offset $2"

        db.query(sqlQuery, [limit, offset]).then((result)=>{
            const response = {
                total : result.rowCount,
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

const searchProduct = (query)=>{
    return new Promise((resolve, reject)=>{
       let {name, order, sort, category_id, page = 1, limit = 3  } = query
        let arr = []
        let sqlQuery = "select * from products "
        if(name){
            sqlQuery += ` where lower (name) like lower ('%' || $${arr.length + 1} || '%')`
            arr.push(name)
        }
        if(category_id){
            sqlQuery += ` and category_id = $${arr.length + 1}`
            arr.push(category_id)
        }
        if(order){
            if(sort === "price"){
                sqlQuery += ` order by price`
            }
            if(sort === "created_at"){
                sqlQuery += ` order by created_at`
            }
            if(order === "asc"){
                sqlQuery += ` asc`
            }
            if(order === "desc"){
                sqlQuery += ` desc`
            }
            // sqlQuery += " order by " + sort + " " + order
        }
        if(!sort){
            sqlQuery += ` order by created_at`
        }
        if(!order){
            sqlQuery += ` asc`
        }
        if(!page){
            page += 1
        }
        if(!limit){
            limit += 2
        }
        if(page){
            
            sqlQuery += ` limit $${arr.length + 1}`
            arr.push(limit)
        }
        const offset = (Number(page-1)) * limit
        if(limit){
            
            sqlQuery += ` offset $${arr.length + 1}`
            arr.push(offset)
        }
        db.query(sqlQuery, arr).then((result)=>{
            const response = {
                limit,
                sort,
                order,
                category_id,
                total : result.rowCount,
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

const getAllProduct = (query)=>{
    return new Promise((resolve, reject)=>{
        // let page = query.page = 1
        // let limit = query.limit = 3
        let {page, limit} = query
        if(!page){
            page = 1
        }
        if(!limit){
            limit = 3
        }
        const offset = (Number(page- 1)) * Number(limit)
        db.query('SELECT * FROM products LIMIT $1 OFFSET $2', [limit, offset])
        .then((result)=>{
            const response = {
                limit,
                total : result.rowCount,
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

const getSingleProduct = (id)=>{
    return new Promise ((resolve, reject)=>{
        const sqlQuery = "SELECT * FROM products WHERE id = $1"
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

const createProduct = (body, file)=>{
    return new Promise((resolve, reject)=>{
        const id = uuidv4()
        const pictures = file? file.path.replace('public', '').replace(/\\/g, '/') : null
        const created_at = new Date(Date.now())
        const {name, descriptions, price, category_id, sizes,} = body
        const sqlQuery = "INSERT INTO products (id, name, descriptions, price, pictures, category_id, sizes, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *"
        db.query(sqlQuery, [id, name, descriptions, price, pictures, category_id, sizes, created_at])
        .then((result)=>{
            const response = {
                data : result.rows,
                err : null
            }
            resolve(response)
        }).catch((err)=>{
            console.log(file);
            console.log(err);
            reject(err)
        })
    })
}

const updateProduct = (id, file, body)=>{
    return new Promise((resolve, reject)=>{
        const pictures = file? file.path.replace('public', '').replace(/\\/g, '/') : null
        const updated_at = new Date(Date.now())
        const {name, descriptions, price, category_id, sizes} = body
        const sqlQuery = "UPDATE products SET name = COALESCE(NULLIF($2, ''), name), descriptions = COALESCE(NULLIF($3, ''), descriptions),  price = COALESCE(NULLIF($4, '')::integer, price), pictures = COALESCE(NULLIF($5, ''), pictures), category_id = COALESCE(NULLIF($6, ''), category_id), sizes = COALESCE(NULLIF($7, ''), sizes), updated_at = COALESCE(NULLIF($8, '')::timestamp, updated_at) WHERE id = $1 RETURNING*"
        db.query(sqlQuery, [id, name, descriptions, price, pictures, category_id, sizes, updated_at])
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

const deleteProduct = (id)=>{
    return new Promise((resolve, reject)=>{
        const sqlQuery = 'DELETE FROM public.products WHERE id = $1 RETURNING *'
        db.query(sqlQuery, [id])
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
module.exports = {
    getAllProduct,
    getSingleProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProduct,
    favoritProduct
}