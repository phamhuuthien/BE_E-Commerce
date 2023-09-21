const ProductCategory = require('../model/productCategory');
const asyncHanler = require('express-async-handler')
const slugify = require('slugify')

const createCategory = asyncHanler(async(req,res) => {
    const response = await ProductCategory.create(req.body)
    return res.json({
        success: response ? true : false,
        createCategory : response ? response : 'cannot create new product category'
    })
})

const getCategories = asyncHanler(async(req,res) => {
    const response = await ProductCategory.find().select("title _id")
    return res.json({
        success: response ? true : false,
        getCategory : response ? response : 'cannot get product category'
    })
})

const updateCategory = asyncHanler(async(req,res) => {
    const {pcid} = req.params
    const response = await ProductCategory.findByIdAndUpdate(pcid,req.body, {new: true})
    return res.json({
        success: response ? true : false,
        updateCategory : response ? response : 'cannot update product category'
    })
})

const deleteCategory = asyncHanler(async(req,res) => {
    const {pcid} = req.params
    const response = await ProductCategory.findByIdAndDelete(pcid)
    return res.json({
        success: response ? true : false,
        deleteCategory : response ? response : 'cannot delete product category'
    })
})

module.exports = {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
}
