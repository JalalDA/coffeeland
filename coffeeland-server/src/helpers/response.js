const response = {}

response.succesResponse = (res, status, msg, data, total) =>{
    res.status(status).json({
        msg,
        total,
        data
    })
}

response.errorResponse = (res, status, msg, data, err) =>{
    res.status(status).json({
        msg,
        data,
        err
    })
}


module.exports = response