let midTransClient = require('midtrans-client')

let snap = new midTransClient.Snap({
    isProduction : false,
    sereverKey : process.env.SERVER_KEY,
    clientKey : process.env.CLIENT_KEY
})

const createPayment = async (orderId, amount)=>{
    const parameter = {
        transaction_details : {
            order_id : orderId,
            gross_amount : amount
        }
    }
    try {
        const result = await snap.createTransaction(parameter);
        return {
            url : result.redirect_url,
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {createPayment, snap}