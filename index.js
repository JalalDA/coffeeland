require('dotenv').config();
const express = require('express')
const cors = require('cors')
const cloudinaryConfig = require('./src/config/cloudinary')


const {db} = require('./src/config/db')
db.connect()
// eslint-disable-next-line no-undef
const port = process.env.PORT
const App = express();

    db.connect().then(()=>{
        const mainRouter = require('./src/routes/index') 
        console.log(`Database connected`);
        App.use(express.static('public'))
        App.use(express.json())
        App.use(express.urlencoded({extended:false}))
        App.use(cors({
            origin: ['*', 'http://localhost:3000', 'https://coffeelands-app.netlify.app'],
            methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        }))
        App.use(cloudinaryConfig)
        App.use(mainRouter)
        App.listen(port, ()=>{
            console.log(`Connected at port ${port}`);
        })

    }).catch((err)=>{
        console.log(err);
    })