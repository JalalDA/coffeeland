
const db = require('../config/db')

const favoritProduct = ()=>{
    return new Promise((resolve, reject)=>{
        const sqlQuery = "SELECT name, price, pictures, count(*) FROM products INNER JOIN transactions ON products.name = transactions.product_name group by products.name, products.price, products.pictures order by count(*) desc"

        db.query(sqlQuery).then((result)=>{
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
        const {name, order, sort, categories } =query
        const arr = [name]
        let sqlQuery = "select * from products where lower (name) like lower ('%' || $1 || '%')"
        if(categories){
            arr.push(categories)
            sqlQuery += " and lower (categories) like lower ('%' || $2 || '%')"
        }
        if(order){
            sqlQuery += " order by " + sort + " " + order
        }

        db.query(sqlQuery, arr).then((result)=>{
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

const getAllProduct = ()=>{
    return new Promise((resolve, reject)=>{
        db.query('SELECT * FROM products')
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

const createProduct = (body)=>{
    return new Promise((resolve, reject)=>{
        const {name, descriptions, price, pictures, categories, sizes, created_at, updated_at} = body
        const sqlQuery = "INSERT INTO products (name, descriptions, price, pictures, categories, sizes, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *"
        db.query(sqlQuery, [name, descriptions, price, pictures, categories, sizes, created_at])
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

const updateProduct = (id, body)=>{
    return new Promise((resolve, reject)=>{
        const {name, descriptions, price, pictures, categories, sizes, updated_at} = body
        const sqlQuery = "UPDATE products SET name = COALESCE(NULLIF($2, ''), name), descriptions = COALESCE(NULLIF($3, ''), descriptions),  price = COALESCE(NULLIF($4, '')::integer, price), pictures = COALESCE(NULLIF($5, ''), pictures), categories = COALESCE(NULLIF($6, ''), categories), sizes = COALESCE(NULLIF($7, ''), sizes), updated_at = COALESCE(NULLIF($8, '')::timestamp, updated_at) WHERE id = $1 RETURNING*"
        db.query(sqlQuery, [id, name, descriptions, price, pictures, categories, sizes, updated_at])
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