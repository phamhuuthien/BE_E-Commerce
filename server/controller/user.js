const User = require('../model/user')
// nếu api lỗi thì sẽ bắn lỗi ra ngoài để mình hứng và handle lỗi
const asyncHanler = require('express-async-handler')
const {genderateAccessToken,genderateRefreshToken} = require('../middlewares/jwt')
const jwt = require('jsonwebtoken')
const sendMail = require('../until/sendMail')
const crypto = require('crypto')


const register = asyncHanler(async(req,res)=>{
    const {email,password,firstname,lastname} = req.body
    if(!email||!password||!firstname||!lastname){
        return res.status(400).json({
            success: false, 
            mes:'missing inputs'
        })
    }

    const user = await User.findOne({ email : email})
    if(user){
        throw new Error('user has existed')
    }else{
        const newUser = await User.create(req.body)
        return res.status(200).json({
            success: newUser ? true : false,
            mes : newUser ? 'Register is successfully. Please go login' : 'something went wrong'
        }) 
    }
})

// refreshtoken => cấp mới accessToken 
// access token => xác thực dùng , quyền của người dùng
const login = asyncHanler(async(req,res)=>{
    const {email,password} = req.body
    if(!email||!password){
        return res.status(400).json({
            success: false,
            mes:'missing inputs'
        })
    }

    // response findone do mongo trả về instance object
    // nên không dùng toán tử rest được
    // toOject để chuyển tài liệu của mongo thành object thuần túy thì mới sử dụng được destructuring 
    const response = await User.findOne({email})
    if(response && await response.isCorrectPassword(password)){
        // không được trả về client pas role => tách password, role ra khỏi response
        const {password,role,refreshToken,...userData} = response.toObject()
        // tạo accesstoken
        const accessToken = genderateAccessToken(response._id,role)
        // tạo resfreshtoken
        const newRefreshToken = genderateRefreshToken(response._id)
        // lưu refreshtoken vào db
        // new : true để trả về data sau khi update (mặc định là false)
        await User.findByIdAndUpdate(response._id,{refreshToken:newRefreshToken},{new:true})
        // set refreshtoken vào cookie 
        res.cookie('refreshToken',refreshToken,{maxAge:7*24*60*60*1000,httpOnly:true})
        return res.status(200).json({
            success: true,
            accessToken,
            userdata : userData
        })
    }else{
        throw new Error("invalid creadentialst")
    }
})

const getcurrent = asyncHanler(async(req,res)=>{
    const{_id} =req.user
    // select không trả về refreshtoken pasword role
    const user = await User.findById(_id).select('-refreshToken -password -role')
    return res.status(200).json({
        success: true,
        rs : user ? user : "user not found"
    }) 
})

const refreshAccessToken = asyncHanler( async(req,res)=>{
    //  lấy cookies
    const cookie = req.cookies
    // check có cookie hay không
    if(!cookie && !cookie.refreshToken) throw new Error("no refresh token in cookies")

    // await nếu jwt.verify có lỗi hắn tự bắn lỗi ra bên ngoài và dừng tại đó không cần check err . nếu không thì trả về decode
    const rs = await jwt.verify(cookie.refreshToken,process.env.JWT_SECRET)
    const response = await User.findOne({_id: rs._id,refreshToken: cookie.refreshToken})
    return res.status(200).json({
        success : response ? true : false,
        newAccesstoekn : response ? genderateAccessToken(response._id,response.role) : 'refresh token not matched'
    })
})

//  logout xóa refreshtoken ở cookie client và trong db
const logout = asyncHanler(async(req,res) => {
    const cookie = req.cookies
    if(!cookie && !cookie.refreshToken) throw new Error("no refresh token in cookies")
    // delete in db
    await User.findOneAndUpdate({refreshToken:cookie.refreshToken},{refreshToken : ''}, {new : true})

    // delete in client

    res.clearCookie('refreshToken',{
        httpOnly: true,
        secure: true
    })
    return res.json({
        success : true,
        mess: "logout is done"
    })
}) 

// forgot password
// client gửi mail
//  server check mail có hợp lệ không -> gửi email -> kèm theo link (pasword change token)


const forgotPassword = asyncHanler( async(req,res)=>{
    const {email} = req.query
    if(!email){
        throw new Error('missing email')
    }
    const user =  await User.findOne({ email: email })
    if(!user) throw new Error('user not found')
    const resetToken = user.createPasswordChangedToken()
    //  lưu 2 filed passwordresetToken passwordresetExprires lại db . Nếu không có sẽ không lưu
    await user.save()

    const html = `xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn. link này sẽ hết hạn sau 15 phút kể từ bây giờ <a href=${process.env.URL_SERVER}/api/user/reset-password/${resetToken} >click here</a>`

    const data = {
        email,
        html
    }
    const rs = await sendMail(data)
    return res.status(200).json({
        success: true,
        rs
    })
})


const resetPassword = asyncHanler( async(req,res)=>{
    const {password,token} = req.body
    if(!password || !token) throw new Error('missing inputs')
    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({passwordResetToken : passwordResetToken, passwordResetExpires : {$gt : Date.now()}})
    if(!user) throw new Error('invalid passwordResetToken')
    user.password = password
    user.passwordChangedAt = Date.now()
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()
    return res.json({
        success: true,
        mess : user ? "updated password" : "something went wrong"
    })

})

const getUsers = asyncHanler( async(req,res) =>{
    const response = await User.find().select('-refreshToken -password -role')
    return res.status(200).json({
        success : response ? true : false,
        user: response
    })
})


// user update
const updateUser =asyncHanler( async(req,res)=>{
    const {_id}= req.user
    if(!_id || Object.keys(req.body).length === 0) throw new Error('missing inputs')
    const response = await User.findByIdAndUpdate(_id, req.body, {new : true}).select('-refreshToken -password -role')
    return res.status(200).json({
        success: response ? true : false,
        mess: response ? `user with email ${response.email} updated` : 'something went wrong'
    })
})

const updateUserAddress =asyncHanler( async(req,res)=>{
    const {_id}= req.user

    if(!req.body) throw new Error('missing inputs')
    const response = await User.findByIdAndUpdate(_id, {address : req.body.address}, {new : true}).select('-refreshToken -password -role')
    return res.status(200).json({
        success: response ? true : false,
        mess: response ? response : 'something went wrong'
    })
})

const updateUserByAdmin =asyncHanler( async(req,res)=>{
    const {_id}= req.params
    if(!_id || Object.keys(req.body).length === 0) throw new Error('missing inputs')
    const response = await User.findByIdAndUpdate(_id, req.body, {new : true}).select('-refreshToken -password -role')
    return res.status(200).json({
        success: response ? true : false,
        mess: response ? `user with email ${response.email} updated` : 'something went wrong'
    })
})

const deleteUser =asyncHanler( async(req,res)=>{
    const {_id}= req.query
    if(!_id) throw new Error('missing inputs')
    const response = await User.findByIdAndDelete(_id, {new : true}).select('-refreshToken -password -role')
    return res.status(200).json({
        success: response ? true : false,
        mess: response ? `user with email ${response.email} deleted` : 'something went wrong'
    })
})

const updateCart =asyncHanler( async(req,res)=>{
    const {_id}= req.user
    const {pid,quantity,color} = req.body
    if(!pid || !quantity || !color) throw new Error('missing inputs')
    const user = await User.findById(_id).select('cart')
    const alreadyProduct = user?.cart?.find(el => el.product.toString()===pid)
    if(alreadyProduct){
        if(alreadyProduct.color === color ){
            const response = await User.updateOne({cart : { $elemMatch : alreadyProduct }},{$set : {"cart.$.quantity" : quantity} },{new : true})
            return res.status(200).json({
                success : response ? true : false,
                updateUser : response ? response : false
            })
        }else{
            const response = await User.findByIdAndUpdate(_id,{$push :{ cart : {product : pid,quantity,color}}}, {new : true})
            return res.status(200).json({
                success: response ? true : false,
                rs: response ? response : 'something went wrong'
            })
        }
    }else{
        const response = await User.findByIdAndUpdate(_id,{$push :{ cart : {product : pid,quantity,color}}}, {new : true})
        return res.status(200).json({
            success: response ? true : false,
            rs: response ? response : 'something went wrong'
        })
    }

    // console.log(user)
    // return res.json('oke')
}) 


module.exports = {
    register,
    login,
    logout,
    //lấy thông tin user hiện tại đang login
    getcurrent,
    getUsers,
    refreshAccessToken,
    forgotPassword,
    resetPassword,
    updateUser,
    updateUserByAdmin,
    deleteUser,
    updateUserAddress,
    updateCart
}


