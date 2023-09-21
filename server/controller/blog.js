const Blog = require('../model/blog')
const asyncHandler = require('express-async-handler')


const createNewBlog = asyncHandler(async(req,res)=>{
    const {title, description, category} = req.body
    if(!title || !description || !category) throw new Error('Mising inputs')
    const response = await Blog.create(req.body)
    return res.json({
        success : response ? true : false,
        createdBlog : response ? response : 'can not create new blog'
    })
})



const updateBlog = asyncHandler(async(req,res)=>{
    const {bid} = req.params
    if(Object.keys(req.body).length === 0 ) throw new Error('Mising inputs')
    const response = await Blog.findByIdAndUpdate(bid,req.body,{ new : true})
    return res.json({
        success : response ? true : false,
        updatedBlog : response ? response : 'can not update blog'
    })
})


const getBlogs = asyncHandler(async(req,res)=>{
    const response = await Blog.find()
    return res.json({
        success : response ? true : false,
        getBlogs : response ? response : 'can not get blogs'
    })
})



/* khi người dùng like một bài blog thì
1. check xem người dùng đó trước đó có dislike hay không => Bỏ dislike
2. check xem người dùng đó trước đó có like hay không => bỏ like hoặc thêm like
*/

const likeBlog = asyncHandler( async(req,res,next) => {
    const {_id} = req.user
    const {bid} = req.params
    if(!bid) throw new Error('missing input')
    const blog = await Blog.findById(bid)
    const alreadyDisliked = blog?.dislikes?.find(el=> el.toString()==_id)
    if(alreadyDisliked){
        // push : thêm vào
        // pull : kéo ra 
        const response = await Blog.findByIdAndUpdate(bid,{$pull :{dislikes :_id}}, {new : true})
        return res.json({
            success : response ? true : false,
            rs : response
        })
    }
    const isLiked = blog?.likes?.find(el=> el.toString()==_id)
    if(isLiked){
        const response = await Blog.findByIdAndUpdate(bid,{$pull :{likes :_id}}, {new : true})
        return res.json({
            success : response ? true : false,
            rs : response
        })
    }else {
        const response = await Blog.findByIdAndUpdate(bid,{$push :{likes :_id}}, {new : true})
        return res.json({
            success : response ? true : false,
            rs : response
        })
    }
})


const disLikeBlog = asyncHandler( async(req,res,next) => {
    const {_id} = req.user
    const {bid} = req.params
    if(!bid) throw new Error('missing input')
    const blog = await Blog.findById(bid)
    const alreadyLiked = blog?.likes?.find(el=> el.toString()==_id)
    if(alreadyLiked){
        // push : thêm vào
        // pull : kéo ra 
        const response = await Blog.findByIdAndUpdate(bid,{$pull :{likes :_id}}, {new : true})
        return res.json({
            success : response ? true : false,
            rs : response
        })
    }
    const isDisLiked = blog?.dislikes?.find(el=> el.toString()==_id)
    if(isDisLiked){
        const response = await Blog.findByIdAndUpdate(bid,{$pull :{dislikes :_id}}, {new : true})
        return res.json({
            success : response ? true : false,
            rs : response
        })
    }else {
        const response = await Blog.findByIdAndUpdate(bid,{$push :{dislikes :_id}}, {new : true})
        return res.json({
            success : response ? true : false,
            rs : response
        })
    }
})

const getBlog = asyncHandler(async(req,res)=>{
    const {bid} = req.params
    const blog = await Blog.findByIdAndUpdate(bid,{$inc: {numberViews : 1}},{new : true})
        .populate('likes','firstname lastname')
        .populate('dislikes','firstname lastname')
    return res.json({
        success : blog ? true : false,
        rs : blog ? blog : 'invalid blog'
    })
})


const deleteBlog = asyncHandler(async(req,res)=>{
    const {bid} = req.params
    const blog = await Blog.findByIdAndDelete(bid)
    return res.json({
        success : blog ? true : false,
        rs : blog ? blog : 'something went wrong '
    })
})


const uploadImageBlog = asyncHandler(async(req,res)=>{
    const {bid} = req.params
    if(!req.file) throw new Error('missing inputs')
    const response = await Blog.findByIdAndUpdate(bid,{ image : req.file.path},{new : true})
    return res.json({
        success : response ? false : false,
        updatedBlog : response ? response :'can not upload image'
    })
})


module.exports = {
    createNewBlog,
    updateBlog,
    deleteBlog,
    getBlogs,
    getBlog,
    likeBlog,
    disLikeBlog,
    uploadImageBlog
}

