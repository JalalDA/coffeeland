const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {LocalStorage} = require('node-localstorage')
const localstorage = new LocalStorage('./cache')
const {succesResponse, errorResponse} = require('../helpers/response')
const {SignUp, getPassByEmail} = require('../models/users')


const Register = async (req, res)=>{
    const password = req.body.password
    const salt = await bcrypt.genSalt()
    const hashPassword = await bcrypt.hash(password, salt)
    try {
        const data = await SignUp(req.body, hashPassword)
        succesResponse(res, 200, "Register Succes!!!", data)
    } catch (error) {
        console.log(error);
        errorResponse(res, 400, "Register failed")
        res.status(400).json({
            error
        })
    }
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
            expiresIn : "1d"
        })
        localstorage.setItem('token', token)
        console.log(localstorage.getItem('token'));
        // eslint-disable-next-line no-undef
        // const refresh_token = jwt.sign(payload, process.env.REFRESH_TOKEN,{
        //     expiresIn : "1d"
        // })
        // await db.query("update users set token = $1 where id = $2", [token, payload.id])
        // res.cookie('token', token, {
        //     httpOnly : true,
        //     maxAge : 24 * 60 * 60 * 1000
        // })
        succesResponse(res, 200, "Login Succes", {payload, token})
        // res.status(200).json({
        //     data : payload,
        //     token
        // })
    } catch (error) {
        console.log(error);
        errorResponse(res, 400, "Login Failed", {error})
        // res.status(400).json({
        //     error
        // })
    }
}

const Logout = async(req, res)=>{
    try {
        const oldtoken = localstorage.getItem('token')
        if(!oldtoken) return errorResponse(res, 400, "You are not sign in")
        // const data = await db.query("select * from users where token = $1", [oldtoken])
        // if(!data) return errorResponse(res, 404, "User not found")
        localstorage.removeItem('token')
        succesResponse(res, 200, "Berhasil Logout")
    } catch (error) {
        res.status(400).json({
            msg : "You are not sign in",
            error
        })
        console.log(error);
    }
}

module.exports = {Register, Login, Logout}