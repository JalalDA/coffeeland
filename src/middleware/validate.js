const validate = {}

validate.findProduct = (req, res, next) =>{
    if(!req.query.name) return res.status(404).json({
        msg : "Name cannot be Empty!!"
    }) 
    next()    
}

module.exports = validate