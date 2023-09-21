const router = require('express').Router()
const {verifyToken,isAdmin} = require('../middlewares/verifyToken')
const ctrls = require('../controller/order')




router.get('/',[verifyToken], ctrls.getUserOrder)
router.get('/admin',[verifyToken,isAdmin], ctrls.getOrders)
router.post('/',[verifyToken], ctrls.createOrder)
router.put('/updatestatus/:oid',[verifyToken,isAdmin], ctrls.updateStatusOrder)


module.exports = router