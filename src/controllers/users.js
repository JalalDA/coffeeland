const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userModels = require('../models/users')
const {getAllUsers, getDetailUser, SignUp, editUser, deleteUser, getPassByEmail} = userModels

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

const Register = async (req, res)=>{
    const password = req.body.password
    const salt = await bcrypt.genSalt()
    const hashPassword = await bcrypt.hash(password, salt)
    try {
        await SignUp(req.body, hashPassword)
        res.status(201).json({
            msg : "Register Berhasil"
        })
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

const Login = async (req, res)=>{
    try {
        const {email, password} = req.body
        const data = await getPassByEmail(email)
        console.log(data);
        const result = await bcrypt.compare(password, data.password)
        if(!result) return res.status(400).json({
            msg : "Wrong email or password"
        })
        const payload = {
            id : data.id,
            displayname : data.displayname
        }
        // eslint-disable-next-line no-undef
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn : "20s"
        })
        res.status(200).json({
            data : payload,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            error
        })
    }
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
    deleteSingleUser,
    Login
}