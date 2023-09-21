const router = require('express').Router()
const {verifyToken,isAdmin} = require('../middlewares/verifyToken')
const ctrls = require('../controller/blog')
const uploader = require('../config/cloudinary.config')
 


router.get('/',ctrls.getBlogs)
router.get('/one/:bid',ctrls.getBlog)
router.post('/',[verifyToken,isAdmin], ctrls.createNewBlog)
router.delete('/:bid',[verifyToken,isAdmin], ctrls.deleteBlog)
router.put('/uploadimage/:bid',[verifyToken,isAdmin],uploader.single('image'), ctrls.uploadImageBlog)
router.put('/likes/:bid',[verifyToken], ctrls.likeBlog)
router.put('/dislikes/:bid',[verifyToken], ctrls.disLikeBlog)
router.put('/:bid',[verifyToken,isAdmin], ctrls.updateBlog)

module.exports = router