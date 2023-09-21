const router = require('express').Router();
const crtls = require('../controller/coupon')
const {verifyToken, isAdmin} = require('../middlewares/verifyToken')


router.get('/', crtls.getCoupon)
router.post('/',[verifyToken, isAdmin], crtls.createCoupon)
router.put('/:cid',[verifyToken, isAdmin], crtls.updateCoupon)
router.delete('/:cid',[verifyToken, isAdmin], crtls.deleteCoupon)


module.exports = router