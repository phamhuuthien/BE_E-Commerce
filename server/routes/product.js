const router = require('express').Router();
const ctrls = require('../controller/product')
const {verifyToken, isAdmin} = require('../middlewares/verifyToken')
const uploader = require('../config/cloudinary.config')


router.post('/',[verifyToken, isAdmin],ctrls.createProduct)
router.put('/uploadimage/:pid',[verifyToken, isAdmin],uploader.array('images',10),ctrls.uploadImagesProduct)
router.get('/',ctrls.getProducts)
router.put('/ratings',verifyToken,ctrls.ratings)
router.delete('/:pid', ctrls.deleteProduct)
router.put('/:pid', ctrls.updateProduct)
router.get('/:pid', ctrls.getProduct)

module.exports = router
