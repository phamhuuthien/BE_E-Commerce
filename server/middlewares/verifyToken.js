const jwt = require('jsonwebtoken')

const asyncHanler = require('express-async-handler')

const verifyToken = asyncHanler( async(req,res,next)=>{
    // bearer token là qui ước thời xưa
    // headers : { authorization: bearer access token}

    // Toán tử ?. được sử dụng để truy cập thuộc tính một cách an toàn, điều này có nghĩa là nếu req hoặc headers là null hoặc undefined, mã sẽ không gây ra lỗi và nó sẽ đơn giản trả về undefined.

    // Bearer token
    if(req?.headers?.authorization?.startsWith('Bearer')){
        const token = req.headers.authorization.split(' ')[1]
        jwt.verify(token, process.env.JWT_SECRET,(err,decode)=>{
            if(err) return res.status(401).json({
                success: false,
                mes: 'invalid access token'
            })
            // them key user vào req
            req.user = decode
            next()
        })
    }else{
        return res.status(401).json({
            success: false,
            mes: 'require authotication !!'
        })
    }
})
const isAdmin = asyncHanler(async(req,res,next)=>{
    const {role} = req.user
    if(role!=='admin') throw new Error('required role admin')
    next()
})

module.exports ={
    verifyToken,
    isAdmin
}