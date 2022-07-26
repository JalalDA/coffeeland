require('dotenv').config();
const express = require('express')
const cors = require('cors')
const cloudinaryConfig = require('./src/config/cloudinary')
const mainRouter = require('./src/routes/index')
const {redisCon} = require('./src/config/redis')
console.log(process.env.GOOGLE_APPLICATION_CREDENTIALS);
const {db} = require('./src/config/db')
db.connect()
redisCon()
// eslint-disable-next-line no-undef
const port = process.env.PORT || 8000
const App = express();

    db.connect().then(()=>{
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