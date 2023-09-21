const userRouters = require('./user')
const productRouters = require('./product')
const productCategoryRouters = require('./productCategory')
const blogCategoryRouters = require('./blogCategory')
const blogRouters = require('./blog')
const brandRouters = require('./brand')
const couponRouters = require('./coupon')
const orderRouters = require('./order')





const { notFound, errHandler } =require('../middlewares/errorHandler')
const initRouters = (app)=>{
    app.use('/api/user',userRouters);
    app.use('/api/product',productRouters)
    app.use('/api/productcategory',productCategoryRouters)
    app.use('/api/blogCategory',blogCategoryRouters)
    app.use('/api/blog',blogRouters)
    app.use('/api/brand',brandRouters)
    app.use('/api/coupon',couponRouters)
    app.use('/api/order',orderRouters)





    app.use(notFound)
    app.use(errHandler)
}
module.exports = initRouters