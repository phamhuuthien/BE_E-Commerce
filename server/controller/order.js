const Order = require('../model/order')
const User = require('../model/user')
const Coupon = require('../model/coupon')

const asyncHandler = require('express-async-handler')


const createOrder = asyncHandler(async(req,res)=>{
    const {_id} = req.user
    const {coupon} = req.body
    const userCart = await User.findById(_id).select('cart').populate('cart.product', 'title price')
    const products = userCart?.cart?.map(el=>({
        product : el.product._id,
        count : el.quantity,
        color : el.color
    }))
    let total = userCart?.cart?.reduce((sum,el)=> el.product.price*el.quantity+sum,0)
    const createData = {products,total, orderBy : _id}
    if(coupon){
        const selectedCoupon = await Coupon.findById(coupon)
        total = Math.round(total*(1-selectedCoupon?.discount/100)/1000)*1000 || total
        createData.total = total
        createData.coupon = coupon
    }
    const rs = await Order.create(createData)
    return res.json({
        success : rs ? true : false,
        rs : rs ? rs : 'something went wrong'
    })
})

const updateStatusOrder = asyncHandler(async(req,res)=>{
    const {oid} = req.params
    const {status} = req.body 
    if(!status) throw new Error('Missing Input')
    const response = await Order.findByIdAndUpdate(oid, {status}, {new : true})
    return res.json({
        success : response ? true : false,
        rs : response ? response : 'something went wrong'
    })
})


const getUserOrder = asyncHandler(async(req,res)=>{
    const {_id} = req.user
    const response = await Order.find({orderBy: _id})
    return res.json({
        success : response ? true : false,
        rs : response ? response : 'something went wrong'
    })
})


const getOrders = asyncHandler(async(req,res)=>{
    // const {_id} = req.user
    const response = await Order.find()
    return res.json({
        success : response ? true : false,
        rs : response ? response : 'something went wrong'
    })
})
module.exports = {
    createOrder,
    updateStatusOrder,
    getUserOrder,
    getOrders
}
