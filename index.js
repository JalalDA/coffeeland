require('dotenv').config();
const express = require('express')
const App = express();
const cookieParser = require('cookie-parser')
const db = require('./src/config/db')
const port = 8000

    db.connect().then(()=>{
        const mainRouter = require('./src/routes/index') 
        console.log(`Database connected`);
        App.use(express.json())
        App.use(express.urlencoded({extended:false}))
        App.use(cookieParser())
        App.use(mainRouter)
        App.listen(port, ()=>{
            console.log(`Connected at port ${port}`);
        })

    }).catch((err)=>{
        console.log(err);
    })