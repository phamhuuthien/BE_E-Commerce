const Brand = require('../model/brand');
const asyncHanler = require('express-async-handler')


const createBrand = asyncHanler(async(req,res) => {
    const response = await Brand.create(req.body)
    return res.json({
        success: response ? true : false,
        createBrand : response ? response : 'cannot create new brand'
    })
})

const getBrand = asyncHanler(async(req,res) => {
    const response = await Brand.find().select("title _id")
    return res.json({
        success: response ? true : false,
        getBrand : response ? response : 'cannot get brand'
    })
})

const updateBrand = asyncHanler(async(req,res) => {
    const {brid} = req.params
    const response = await Brand.findByIdAndUpdate(brid,req.body, {new: true})
    return res.json({
        success: response ? true : false,
        updateBrand : response ? response : 'cannot update brand'
    })
})

const deleteBrand = asyncHanler(async(req,res) => {
    const {brid} = req.params
    const response = await Brand.findByIdAndDelete(brid)
    return res.json({
        success: response ? true : false,
        deleteBrand : response ? response : 'cannot delete brand'
    })
})

module.exports = {
    createBrand,
    getBrand,
    updateBrand,
    deleteBrand
}
