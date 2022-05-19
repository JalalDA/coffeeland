const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {LocalStorage} = require('node-localstorage')
const localstorage = new LocalStorage('./cache')
const {succesResponse, errorResponse} = require('../helpers/response')
const {SignUp, getPassByEmail} = require('../models/users')


const Register = async (req, res)=>{
    try {
        const password = req.body.password
        const salt = await bcrypt.genSalt()
        const hashPassword = await bcrypt.hash(password, salt)
        const data = await SignUp(req.body, hashPassword)
        succesResponse(res, 200, "Register Succes!!!", data)
    } catch (error) {
        console.log(error);
        errorResponse(res, 400, "Register failed")
    }
}

const Login = async (req, res)=>{
    try {
        const {email, password} = req.body
        const data = await getPassByEmail(email)
        const result = await bcrypt.compare(password, data.password)
        if(!result) return res.status(400).json({
            msg : "Wrong email or password"
        })
        // eslint-disable-next-line no-undef
        const token = jwt.sign(data, process.env.JWT_SECRET, {
            expiresIn : "1d"
        })
        console.log(data);
        localstorage.setItem(`token${data.id}`, token)
        const {id, displayname} = data
        succesResponse(res, 200, "Login Succes", {id, displayname, token})
    } catch (error) {
        console.log(error);
        errorResponse(res, 400, "Login Failed", {error})
    }
}

const Logout = async(req, res)=>{
    try {
    const bearerToken = req.header('Authorization')
    if(!bearerToken) return res.status(403).json({
        msg : "You need to sign in"
    })
    const oldtoken = bearerToken.split(" ")[1]
    // eslint-disable-next-line no-undef
    jwt.verify(oldtoken, process.env.JWT_SECRET, (err, data)=>{
        if(err) res.status(500).json({msg : "cannot logout"})
        localstorage.removeItem(`token${data.id}`)
        succesResponse(res, 200, "Berhasil Logout")
    })
        // const oldtokenNew = localstorage.getItem('token')
        // if(!oldtoken) return errorResponse(res, 400, "You are not sign in")
        // const data = await db.query("select * from users where token = $1", [oldtoken])
        // if(!data) return errorResponse(res, 404, "User not found")

    } catch (error) {
        res.status(400).json({
            msg : "You are not sign in",
            error
        })
        console.log(error);
    }
}

module.exports = {Register, Login, Logout}