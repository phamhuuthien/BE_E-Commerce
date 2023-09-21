const router = require('express').Router();
const crtls = require('../controller/productCategory')
const {verifyToken, isAdmin} = require('../middlewares/verifyToken')


router.get('/', crtls.getCategories)
router.post('/',[verifyToken, isAdmin], crtls.createCategory)
router.put('/:pcid',[verifyToken, isAdmin], crtls.updateCategory)
router.delete('/:pcid',[verifyToken, isAdmin], crtls.deleteCategory)


module.exports = router