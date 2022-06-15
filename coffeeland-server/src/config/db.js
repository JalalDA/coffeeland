const psql = require('pg')

const {Pool} = psql

const db = new Pool({
    // eslint-disable-next-line no-undef
    user : process.env.DB_USER,
    // eslint-disable-next-line no-undef
    host : process.env.DB_HOST,
    // eslint-disable-next-line no-undef
    database : process.env.DB_DATABASE,
    // eslint-disable-next-line no-undef
    password : process.env.DB_PASS,
    // eslint-disable-next-line no-undef
    port : process.env.DB_PORT
    // eslint-disable-next-line no-undef
    // connectionString: process.env.DATABASE_URL,
    // ssl: {
    //   rejectUnauthorized: false
    // }
})

const connection = async ()=>{
    try {
        await db.connect();
        console.log(`Database connected`);
    } catch (error) {
        console.log(error);
    }
}
module.exports = {db, connection}