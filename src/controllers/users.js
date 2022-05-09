const userModels = require('../models/users')
const {getAllUsers, getDetailUser, SignUp, editUser, deleteUser} = userModels

const getAllUser = (req, res)=>{
    getAllUsers()
    .then((result)=>{
        res.status(200).json({
            data : result.data,
            err : null
        })
    })
    .catch((err)=>{
        console.log(err);
        res.status(400).json({
            data : null,
            err
        })
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

const Register = (req, res)=>{
    SignUp(req.body)
    .then((result)=>{
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
    deleteSingleUser
}