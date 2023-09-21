const Product = require('../model/product');
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')

const createProduct = asyncHandler(async(req,res)=>{
    
    if(Object.keys(req.body).length==0) throw new Error('missing inputs')
    
    // create slug
    if(req.body && req.body.title){
        req.body.slug = slugify(req.body.title)
    }
    const newProduct = await Product.create(req.body)
    return res.status(200).json({
        success : newProduct ? true: false,
        createProduct : newProduct ? newProduct : 'do not new product'
    })
})


// detail Product
const getProduct = asyncHandler(async(req,res)=>{
    const {pid} = req.params
    const product = await Product.findById(pid)
    return res.status(200).json({
        success : product ? true : false,
        productData : product ? product : 'cannot get product'
    })
})


// fillter sort paganigation

// title=bàn phím&price[gt]=5000&sort=-price,title
const getProducts = asyncHandler(async(req,res)=>{
    const queryObj = { ...req.query }
    // console.log(queryObj)    { title: 'bàn phím', price: { gt: '5000' }, sort: '-price,title' }
    const excludedFields = ['page', 'sort', 'limit', 'fields']
    excludedFields.forEach(el => delete queryObj[el])
    // console.log(queryObj)    { title: 'bàn phím', price: { gt: '5000' } }

    //  chuyển qua string để dùng methob replace 
    let queryString = JSON.stringify(queryObj)
    // console.log(queryString)     {"title":"bàn phím","price":{"gt":"5000"}}
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)    
    // console.log(queryString)     {"title":"bàn phím","price":{"$gt":"5000"}}
    const formatedQueries = JSON.parse(queryString)

    // key : value => price[gt] = 5000   => lấy item có giá lớn hơn 5000

    // lọc theo tên sản phẩm : chỉ cần trong tên sản phẩm chứa input nhập vào thì vẫn lọc ra 
    if(queryObj?.title) formatedQueries.title = {$regex : queryObj.title, $options : 'i'}

    // không sử dụng await nên đang ở trạng thái promise pending để có thêm thêm các query khác
    let queryCommand = Product.find(formatedQueries)

    // sorting
    if (req.query.sort) {
        // nếu muốn sort 2 field : price,title => [price,title] => price title
        // -price giảm dần , price tăng dần
        const sortBy = req.query.sort.split(',').join(' ')
        queryCommand = queryCommand.sort(sortBy)
    } else {
        queryCommand = queryCommand.sort('-createdAt')
    }


    
    //3) Field Limiting
    // Select pattern  .select("firstParam secondParam"), it will only show the selected field, add minus 
    // sign for excluding (include everything except the given params)
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ')
        queryCommand = queryCommand.select(fields)
    } else {
        queryCommand = queryCommand.select('-__v')
    }
  
    // 4) Pagination
    // page=2&limit=10, 1-10 page 1, 11-20 page 2, 21-30 page 3
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page - 1) * limit;

    // query = query.skip(skip).limit(limit);
  

    const limit = process.env.LIMIT_PROCESS || 2
    const page = req.query.page || 1
    const skip = (page-1)*limit 
    queryCommand = queryCommand.skip(skip).limit(limit)


    queryCommand
    .then(async(response)=>{
        const counts = await Product.find(formatedQueries).countDocuments()
        return res.status(200).json({
            success : response ? true : false,
            productData : response ? response : 'cannot get product',
            counts
        })
    })
    .catch((err)=> {
        return err.message
    })
})



const updateProduct = asyncHandler(async(req,res)=>{
    const {pid} = req.params
    if(req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const updateProduct = await Product.findByIdAndUpdate(pid,req.body, {new : true})
    return res.status(200).json({
        success : updateProduct ? true : false,
        productData : updateProduct ? updateProduct : 'cannot update product'
    })
})

const deleteProduct = asyncHandler(async(req,res)=>{
    const {pid} = req.params
    const deleteProduct = await Product.findByIdAndDelete(pid)
    return res.status(200).json({
        success : deleteProduct ? true : false,
        productData : deleteProduct ? 'delete product successfully' : 'cannot delete product'
    })
})


const ratings = asyncHandler(async(req,res)=>{
    const {_id} = req.user
    const {star, comment, pid} = req.body
    if(!star || !pid) throw new Error('missing inputs')
    // lần đầu đánh giá 
    // lần 2 muốn sửa lại đánh giá 
    const ratingProduct = await Product.findById(pid)
    const alreadyProduct = ratingProduct?.ratings?.find(el =>{
        return el.postedBy.toString() === _id
    }) 
    // đánh giá rồi thì sẽ vào đây
    if(alreadyProduct){
        await Product.updateOne({
            ratings : { $elemMatch : alreadyProduct}
        },{
            $set : {
                // $ đối tượng eleMathch mà nó tìm được
                "ratings.$.star" : star,
                "ratings.$.comment" : comment
            }
        },{new : true})
    }else{
        await Product.findByIdAndUpdate(pid, {
            $push: {ratings : {star, comment, postedBy : _id}}
        },{new : true})
    }

    //  sum ratings
    const updatedProduct = await Product.findById(pid)
    const countRatings = updatedProduct.ratings.length
    const sumStarRatings = updatedProduct.ratings.reduce(((sum, el) => sum + el.star),0)
    updatedProduct.totalRatings = Math.round(sumStarRatings*10/countRatings)/10 

    await updatedProduct.save()

    return res.status(200).json({
        success : ratingProduct ? true: false,
        updatedProduct
    })
})

const uploadImagesProduct = asyncHandler(async(req,res)=>{
    const {pid} = req.params
    if(!req.files) throw new Error('missing inputs')
    const response = await Product.findByIdAndUpdate(pid,{$push : { images : {$each : req.files.map(el=>el.path)}}})
    return res.json({
        success : response ? false : false,
        updatedProduct : response ? response :'can not upload images'
    })
})


module.exports ={
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    ratings,
    uploadImagesProduct
}





