const response = {}

response.succesResponse = (res, msg, data, total) =>{
    res.status(200).json({
        msg,
        total,
        data
    })
}

response.errorResponse = (res, msg, data, err) =>{
    res.status(400).json({
        msg,
        data,
        err
    })
}


module.exports = response