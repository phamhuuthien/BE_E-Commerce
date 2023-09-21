//  lỗi này biết trước
const notFound = (req,res,next)=>{
    const error = new Error(`router ${req.originalUrl} not found`)
    res.status(404)
    next(error)
}

// buộc phải có next mới bắt được  
const errHandler = (error,req,res,next)=>{
    const statusCode = res.statusCode ===200 ? 500 : res.statusCode
    return res.status(statusCode).json({
        success : false,
        mes : error?.message
    })
}
module.exports = {notFound, errHandler}