const multer = require('multer')
const path = require('path')

const storageProduct = multer.diskStorage({
    destination : (req, file, cb)=>{
        cb(null, './public/products/images')
    },
    filename : (req, file, cb)=>{
        const suffix = `${Date.now()}`
        const filename = `${file.fieldname}-${suffix}${path.extname(file.originalname)}`
        cb(null, filename)
    }
    
})

const limit = {
    fileSize : 3e6
}

const imageOnlyFilter = (req, file, cb)=>{
    const extName = path.extName(file.originalname)
    const allowedExt = /jpg|png/
    if(!allowedExt.test(extName))
    return cb(new Error("Please insert jpg or png only"), false)
    cb(null, true)
}

const productImageUpload = multer({
    storage : storageProduct,
    limits : limit,
    filefilter : imageOnlyFilter 
})

module.exports = productImageUpload