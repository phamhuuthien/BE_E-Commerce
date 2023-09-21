const router = require('express').Router();
const crtls = require('../controller/blogCategory ')
const {verifyToken, isAdmin} = require('../middlewares/verifyToken')


router.get('/', crtls.getCategories)
router.post('/',[verifyToken, isAdmin], crtls.createCategory)
router.put('/:bcid',[verifyToken, isAdmin], crtls.updateCategory)
router.delete('/:bcid',[verifyToken, isAdmin], crtls.deleteCategory)


module.exports = router