const validate = {}

validate.findProduct = (req, res, next) =>{
    if(!req.query.name) return res.status(404).json({
        msg : "Name cannot be Empty!!"
    }) 
    if(req.query.order !== 'desc' || req.query.order !== 'asc') return res.status(400).json({
        msg : "Order must be desc or asc"
    })
    next()    
}

module.exports = validate