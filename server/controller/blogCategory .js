const BlogCategory = require('../model/blogCategory');
const asyncHanler = require('express-async-handler')
const slugify = require('slugify')

const createCategory = asyncHanler(async(req,res) => {
    const response = await BlogCategory.create(req.body)
    return res.json({
        success: response ? true : false,
        createCategory : response ? response : 'cannot create new blog category'
    })
})

const getCategories = asyncHanler(async(req,res) => {
    const response = await BlogCategory.find().select("title _id")
    return res.json({
        success: response ? true : false,
        getCategory : response ? response : 'cannot get blog category'
    })
})

const updateCategory = asyncHanler(async(req,res) => {
    const {bcid} = req.params
    const response = await BlogCategory.findByIdAndUpdate(bcid,req.body, {new: true})
    return res.json({
        success: response ? true : false,
        updateCategory : response ? response : 'cannot update blog category'
    })
})

const deleteCategory = asyncHanler(async(req,res) => {
    const {bcid} = req.params
    const response = await BlogCategory.findByIdAndDelete(bcid)
    return res.json({
        success: response ? true : false,
        deleteCategory : response ? response : 'cannot delete blog category'
    })
})

module.exports = {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
}
