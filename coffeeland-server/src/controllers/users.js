const bcrypt = require('bcrypt')
const {succesResponse, errorResponse} = require('../helpers/response')
const {db} = require('../config/db')

const userModels = require('../models/users')
const {getAllUsers, getDetailUser, SignUp, editUser, deleteUser, updateUserUpload} = userModels

const editUserUpload = async (req, res)=>{
    try {
    const id = req.userPayload.id
    const {file = null} = req
    const result = await updateUserUpload(id, file, req.body)
    res.status(200).json({
        msg : result.msg,
        data : result.data
    })
    } catch (error) {
        res.status(400).json({
            msg : "Cannot update ",
            error,
        })
        console.log(error);
    }
}

const getAllUser = async (req, res)=>{
    try {
        const result = await getAllUsers(req.query)
        const total = await db.query('select count(*) as totaldata from users')
        const totalData = total.rows[0].totaldata
        const limit = result.limit
        const totalPage = Math.ceil(totalData / limit)
        let curentPage = Number(req.query.page)
        if(!curentPage){
            curentPage = 1
        }
        const path = req.path
        let nextPage = `/user${path}?page=${curentPage + 1}`
        let previousPage = `/user${path}?page=${curentPage-1}`
        const {total_product} = total.rows[0]
        const totalpage = Math.ceil(Number(total_product)/Number(limit))
        if(totalpage === curentPage) {
            nextPage = `This is the last page`
        }
        if(curentPage === 1 ){
            previousPage = `This is the first page`
        }
        res.status(200).json({
            msg : 'Succes get all data',
            totalData,
            totalPage,
            curentPage,
            nextPage,
            previousPage,
            data : result.data
        })
    } catch (error) {
        console.log(error);
        errorResponse(res, 400, 'Failed to get all data')
    }
}

const getDetailUserController = (req, res)=>{
    const id = req.params.id
    getDetailUser(id)
    .then((result)=>{
        res.status(200).json({
            data : result.data,
            err : null
        })
    })
    .catch((err)=>{
        console.log(err);
        res.status(400).json({
            data : [],
            err
        })
    })
}

const Register = async (req, res)=>{
    try {
        const password = req.body.password
        const salt = await bcrypt.genSalt()
        const hashPassword = await bcrypt.hash(password, salt)
        const result = await SignUp(req.body, hashPassword)
        succesResponse(res, 200, "Register Succes!!!", result.data)
    } catch (error) { 
        console.log(error);
        res.status(400).json({
            error
        })
    }

    // SignUp(req.body)
    // .then((result)=>{
    //     res.status(200).json({
    //         data : result.data,
    //         err : null
    //     })
    // }).catch((err)=>{
    //     res.status(400).json({
    //         data : [],
    //         err
    //     })
    // })
}



// const Logout = async(req, res)=>{
//     const id = req.params.id
//     const token = req.cookies.token
//     if(!token) return res.sendStatus(204)
//     const user = await getDetailUser(id)
// }

const updateUser = (req, res)=>{
    const id = req.userPayload.id
    const body = req.body
    editUser(id, body)
    .then((result)=>{
        console.log(id);
        res.status(200).json({
            
            data : result.data,
            err : null
        })
    }).catch((err)=>{
        console.log(id);
        res.status(400).json({
            data : [],
            err
        })
    })
}

const deleteSingleUser = (req, res)=>{
    const id = req.params.id
    deleteUser(id)
    .then((result)=>{
        res.status(200).json({
            msg : "User has been deleted",
            data : result.data,
            err : null
        })
    }).catch((err)=>{
        res.status(400).json({
            data : [],
            err
        })
    })
}
module.exports = {
    getAllUser,
    getDetailUserController,
    Register,
    updateUser,
    deleteSingleUser,
    editUserUpload
}