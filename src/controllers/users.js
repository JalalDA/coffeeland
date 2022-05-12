const bcrypt = require('bcrypt')
const {succesResponse, errorResponse} = require('../helpers/response')

const userModels = require('../models/users')
const {getAllUsers, getDetailUser, SignUp, editUser, deleteUser} = userModels

const getAllUser = (req, res)=>{
    getAllUsers(req.query)
    .then((result)=>{
        succesResponse(res, 200, "Succes get all data", result.data, result.total)
    })
    .catch((err)=>{
        console.log(err);
        errorResponse(res, 400, {msg : err}, err)
    })
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
    const password = req.body.password
    const salt = await bcrypt.genSalt()
    const hashPassword = await bcrypt.hash(password, salt)
    try {
        await SignUp(req.body, hashPassword)
        succesResponse(res, 200, "Register Succes!!!")
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
    const id = req.params.id
    const body = req.body
    editUser(id, body).then((result)=>{
        res.status(200).json({
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
}