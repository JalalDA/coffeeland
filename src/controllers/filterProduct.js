const {getProductsFromServer} = require('../models/filterProduct')

const getFilterProduct = async (req, res)=>{
    try {
        const result = await getProductsFromServer(req.query)
        res.status(200).json({
            data : result
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            error
        })
    }
}

module.exports = {
    getFilterProduct
}