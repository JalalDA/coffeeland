const multer = require('multer')
const path = require('path')

const storageUsers = multer.diskStorage({
    destination : (req, file, cb)=>{
        cb(null, './public/users/images')
    },
    filename : (req, file, cb)=>{
        const suffix = `${Date.now()}`
        const filename = `${file.fieldname}-${suffix}${path.extname(file.originalname)}`
        cb(null, filename)
    }
})

const storageProduct = multer.diskStorage({
    destination : (req, file, cb)=>{
        cb(null, './public/products/images')
    },
    filename : (req, file, cb)=>{
        const suffix = `${Date.now()}`
        const filename = `product-${file.fieldname}-${suffix}${path.extname(file.originalname)}`
        cb(null, filename)
    }
})

const limit = {
    fileSize : 3e6
}

const imageOnlyFilter = (req, file, cb)=>{
    const extName = path.extname(file.originalname)
    const allowedExt = /jpg|png/
    if(!allowedExt.test(extName))
    return cb(new Error("Please insert jpg or png only"), false)
    cb(null, true)
}

const uploadUsers = multer({
    storage : storageUsers,
    limits : limit,
    filefilter : imageOnlyFilter 
})

const uploadProducts = multer({
    storage : storageProduct,
    limits : limit,
    fileFilter : imageOnlyFilter
})

module.exports = {uploadUsers, uploadProducts}