const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
// const {LocalStorage} = require('node-localstorage')
// const localstorage = new LocalStorage('./cache')
const {succesResponse, errorResponse} = require('../helpers/response')
const {SignUp, getPassByEmail, updatePass} = require('../models/users')
const nodemailer = require('nodemailer')
const randomstring = require('randomstring')
const {client} = require('../config/redis')


const Register = async (req, res)=>{
    try {
        const password = req.body.password
        const salt = await bcrypt.genSalt()
        const hashPassword = await bcrypt.hash(password, salt)
        const data = await SignUp(req.body, hashPassword)
        succesResponse(res, 200, "Register Succes!!!", data)
    } catch (error) {
        console.log(error);
        errorResponse(res, 400, "Register failed", error)
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
        const {id} = data
        await client.set(`token${id}`, token)
        const {photo, role} = data
        succesResponse(res, 200, "Login Succes", {photo, role, token})
    } catch (error) {
        console.log(error);
        errorResponse(res, 400, "Login Failed", {error})
    }
}

const Logout = async(req, res)=>{
    try {
    const bearerToken = req.header('Authorization')
    console.log(bearerToken);
    const oldtoken = bearerToken.split(" ")[1]
    const {id} = req.userPayload
    const cacheToken = await client.get(`token${id}`)
    if(!cacheToken){
        return res.status(200).json({
            msg : "You need to sign in"
        })
    }
    if(cacheToken){
        await client.del(`token${id}`)
    }
    return res.status(200).json({
        msg : "Logout Success"
    })
    // // eslint-disable-next-line no-undef
    // jwt.verify(oldtoken, process.env.JWT_SECRET, (err, data)=>{
    //     if(err) res.status(500).json({msg : "cannot logout"})
    //     await client.del()
    //     succesResponse(res, 200, "Logged out succes")
    // })
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

const ForgotPassword = async (req, res)=>{
    try {
        const {email} = req.body
        const transporter = nodemailer.createTransport({
            host : process.env.DB_HOST,
            service : process.env.SERVICE,
            port : 587,
            secure : true,
            auth : {
                user : process.env.USER,
                pass : process.env.PASS
            }
        })
        const result = await getPassByEmail(email)
        // if(!result){
        //     return res.status(200).json({
        //         msg : "Email is not registered"
        //     })
        // }
        const code = randomstring.generate({
            length : 6,
            charset : 'alphanumeric',
            capitalization : 'uppercase'
        })
        const sendMail = await transporter.sendMail({
            from : process.env.USER,
            to : email,
            subject : 'Forgot password',
            text : `Please enter this verification code 
            
            ${code}
            
            this code will expired in 10 minutes`
        })
        console.log(sendMail);
        await client.set(`code-${email}`, code)
        res.status(200).json({
            msg : 'Email send succesfully'
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg : "Plese input valid email"
        })
    }
}

const resetPassword = async (req, res)=>{
    try {
        const {newPassword, email, confirmPassword, code} = req.body
        if(newPassword !== confirmPassword){
            res.status(400).json({
                msg : "New password and confirm password doesnt match"
            })
        }
        const saveCode = await client.get(`code-${email}`)
        if(code !== saveCode){
            res.status(400).json({
                msg : "Please input the correct code"
            })
        }
        const result = await updatePass(newPassword, email)
        if(result){
            await client.del(`code-${email}`)
        }
        res.status(200).json({
            msg : "Succes reset password"
        })
    } catch (error) {
        console.log(error);
    }
}

module.exports = {Register, Login, Logout, ForgotPassword, resetPassword}