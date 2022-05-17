const jwt = require('jsonwebtoken')
const {getUserByEmail} = require('../models/users')
const {LocalStorage} = require('node-localstorage')
const localstorage = new LocalStorage('./cache')

const chekDuplicateEmail = (req, res, next)=>{
    getUserByEmail(req.body.email)
    .then((result)=>{
        if(result.rowCount > 0)
        return res.status(400).json({
            msg : "Email is already used"
        })
        next()
    }).catch((err)=>{
        res.status(400).json({
            err
        })
    })
}

const verifyToken = (req, res, next)=>{
    const bearerToken = req.header('Authorization')
    if(!bearerToken) return res.status(403).json({
        msg : "You need to sign in"
    })
    const oldtoken = bearerToken.split(" ")[1]
    // localstorage.setItem('token', bearerToken)
    
    // eslint-disable-next-line no-undef
    jwt.verify(oldtoken, process.env.JWT_SECRET, (err, payload)=>{
        if (err && err.name === "TokenExpiredError") return res.status(401).json({
            msg : "You need to sign in again"
        })
        const newToken = localstorage.getItem(`token${payload.id}`)
        if(oldtoken !== newToken) return res.status(403).json({
            msg : 'You are loged out'
        })
        req.userPayload = payload
        console.log(req.userPayload.id);
        next()
    })
}

const verifyTokenAmdin = (req, res, next)=>{
    const bearerToken = req.header('Authorization')
    if(!bearerToken) return res.status(403).json({
        msg : "You need to sign in"
    })
    const oldtoken = bearerToken.split(" ")[1]
    // eslint-disable-next-line no-undef
    jwt.verify(oldtoken, process.env.JWT_SECRET, (err, payload)=>{
        if (err && err.name === "TokenExpiredError") return res.status(401).json({
            msg : "You need to sign in again"
        })
        const newToken = localstorage.getItem(`token${payload.id}`)
        if(oldtoken !== newToken) return res.status(403).json({
            msg : 'You are loged out'
        })
        if(payload.role !== 'admin') return res.status(403).json({msg : "You are not admin"})
        req.userPayload = payload
        next()
    })
}

module.exports = {chekDuplicateEmail, verifyToken, verifyTokenAmdin}