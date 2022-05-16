require('dotenv').config();
const express = require('express')

const cookieParser = require('cookie-parser')
const {connection} = require('./src/config/db')
connection()
const port = 8000
const App = express();
const mainRouter = require('./src/routes/index')
    App.use(express.static('public'))
    App.use(express.json())
    App.use(express.urlencoded({extended:false}))
    App.use(cookieParser())
    App.use(mainRouter)
    App.listen(port, ()=>{
        console.log(`Connected at port ${port}`);
    })
    // db.connect().then(()=>{
    //     const mainRouter = require('./src/routes/index') 
    //     console.log(`Database connected`);
    //     App.use(express.static('public'))
    //     App.use(express.json())
    //     App.use(express.urlencoded({extended:false}))
    //     App.use(cookieParser())
    //     App.use(mainRouter)
    //     App.listen(port, ()=>{
    //         console.log(`Connected at port ${port}`);
    //     })

    // }).catch((err)=>{
    //     console.log(err);
    // })