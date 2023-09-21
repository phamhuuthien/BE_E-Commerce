const router = require('express').Router();
const crtls = require('../controller/brand')
const {verifyToken, isAdmin} = require('../middlewares/verifyToken')


router.get('/', crtls.getBrand)
router.post('/',[verifyToken, isAdmin], crtls.createBrand)
router.put('/:brid',[verifyToken, isAdmin], crtls.updateBrand)
router.delete('/:brid',[verifyToken, isAdmin], crtls.deleteBrand)


module.exports = router