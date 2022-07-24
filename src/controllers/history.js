const historyModels = require('../models/history')
const {getHistory, deleteHistory} = historyModels

const getHistoryTransaction = async(req, res)=>{
    try {
        const {id} = req.userPayload
        const result = await getHistory(id)
        console.log(result.data);
        res.status(200).json({
            data : result.data
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            msg : "Cannot get Transaction",
            error
        })
    }
}

const deleteHistoryTransaction = async (req, res)=>{
    try {
        const result = await deleteHistory(req.body)
        res.status(200).json({
            msg : 'Succes delete history',
            data : result.data
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg : 'Cannot delete history',
            data : error
        })
    }
}

module.exports = {getHistoryTransaction, deleteHistoryTransaction}