const multer = require('multer')
const path = require('path')
const {CloudinaryStorage} = require('multer-storage-cloudinary')
const cloudinary = require('cloudinary').v2
const storage = new  CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'coffeeland',
    //   format: async (req, file) => 'png', // supports promises as well
    //   public_id: (req, file) => 'computed-filename-using-request',
    },
  });

// const storageUsers = multer.diskStorage({
//     destination : (req, file, cb)=>{
//         cb(null, './public/users/images')
//     },
//     filename : (req, file, cb)=>{
//         const suffix = `${Date.now()}`
//         const filename = `${file.fieldname}-${suffix}${path.extname(file.originalname)}`
//         cb(null, filename)
//     }
// })

// const storageProduct = multer.diskStorage({
//     destination : (req, file, cb)=>{
//         cb(null, './public/products/images')
//     },
//     filename : (req, file, cb)=>{
//         const suffix = `${Date.now()}`
//         const filename = `product-${file.fieldname}-${suffix}${path.extname(file.originalname)}`
//         cb(null, filename)
//     }
// })

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
    storage : storage,
    limits : limit,
    filefilter : imageOnlyFilter 
})

const uploadProducts = multer({
    storage : storage,
    limits : limit,
    fileFilter : imageOnlyFilter
})

module.exports = {uploadUsers, uploadProducts}