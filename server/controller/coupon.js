const Coupon = require('../model/coupon');
const asyncHanler = require('express-async-handler')


const createCoupon = asyncHanler(async(req,res) => {
    const {name , discount, expiry} = req.body
    if(!name || !discount || !expiry) throw new Error('missing input')
    const response = await Coupon.create({
        ...req.body,
        expiry :Date.now() + expiry*24*60*60*1000
    })
    return res.json({
        success: response ? true : false,
        createCategory : response ? response : 'cannot create new Coupon'
    })
})

const getCoupon = asyncHanler(async(req,res) => {
    const response = await Coupon.find()
    return res.json({
        success: response ? true : false,
        getCategory : response ? response : 'cannot get Coupon'
    })
})

const updateCoupon = asyncHanler(async(req,res) => {
    const {cid} = req.params
    if(Object.keys(req.body).length===0) throw Error('missing input')
    const response = await Coupon.findByIdAndUpdate(cid,req.body, {new: true})
    return res.json({
        success: response ? true : false,
        updateCategory : response ? response : 'cannot update Coupon'
    })
})

const deleteCoupon = asyncHanler(async(req,res) => {
    const {cid} = req.params
    const response = await Coupon.findByIdAndDelete(cid)
    return res.json({
        success: response ? true : false,
        deleteCategory : response ? response : 'cannot delete Coupon'
    })
})

module.exports = {
    createCoupon,
    getCoupon,
    updateCoupon,
    deleteCoupon
}
