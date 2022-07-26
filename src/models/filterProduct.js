const {db} = require('../config/db')


const getProductsFromServer = (query) => {
    return new Promise((resolve, reject) => {
        const { name, category, sort = "category_id", order = "asc", page = 1, limit = 20 } = query;
        let offset = (Number(page) - 1) * Number(limit);
        let parameterize = [];
        let totalParam = [];
        let totalQuery = "select count(products.id) as total_products from products join categories on products.category_id = categories.id";
        let sqlQuery = "select products.id, products.name, products.price, products.pictures, categories.category_name as category, products.created_at from products join categories on products.category_id = categories.id";
        if (!name && !category) {
            sqlQuery += " order by " + sort + " " + order + " LIMIT $1 OFFSET $2";
            parameterize.push(Number(limit), offset);
        }
        if (name && !category) {
            sqlQuery += " where lower(products.name) like lower('%' || $1 || '%') order by " + sort + " " + order + " LIMIT $2 OFFSET $3";
            totalQuery += " where lower(products.name) like lower('%' || $1 || '%')";
            parameterize.push(name, Number(limit), offset);
            totalParam.push(name);
        }
        if (category && !name) {
            sqlQuery += " where categories.category_name = $1 order by " + sort + " " + order + " LIMIT $2 OFFSET $3";
            totalQuery += " where categories.category_name = $1";
            parameterize.push(category, Number(limit), offset);
            totalParam.push(category);
        }
        if (name && category) {
            sqlQuery += " where categories.category_name = $2 AND lower(products.name) like lower('%' || $1 || '%') order by " + sort + " " + order + " LIMIT $3 OFFSET $4";
            totalQuery += " where categories.category_name = $2 AND lower(products.name) like lower('%' || $1 || '%')";
            parameterize.push(name, category, Number(limit), offset);
            totalParam.push(name, category);
        }
        db.query(sqlQuery, parameterize)
            .then(result => {
                if (result.rows.length === 0) {
                    return reject({ status: 404, err: "Products Not Found" });
                }
                const response = {
                    total: result.rowCount,
                    data: result.rows
                };
                db.query(totalQuery, totalParam)
                    .then((result) => {
                        response.totalData = Number(result.rows[0]["total_products"]);
                        response.totalPage = Math.ceil(response.totalData / Number(limit));
                        resolve(response);
                    })
                    .catch(err => {
                        reject({ status: 500, err });
                    });

            })
            .catch(err => {
                reject({ status: 500, err });
            });
    });
};

module.exports = {
    getProductsFromServer
}