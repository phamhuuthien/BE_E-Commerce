const router = require('express').Router();
const ctrls = require('../controller/user')
const {verifyToken, isAdmin} = require('../middlewares/verifyToken')

// post register
router.post('/register', ctrls.register)

// post login
router.post('/login', ctrls.login)

router.get('/logout', ctrls.logout)



router.get('/current',verifyToken,ctrls.getcurrent)

router.post('/refreshToken',ctrls.refreshAccessToken)
router.get('/forgotPassword',ctrls.forgotPassword)
router.post('/resetPassword',ctrls.resetPassword)


router.get('/getAllUsers',verifyToken,isAdmin,ctrls.getUsers)

router.put('/updateUser',verifyToken,ctrls.updateUser)

router.delete('/',[verifyToken,isAdmin],ctrls.deleteUser)
router.put('/address',[verifyToken],ctrls.updateUserAddress)
router.put('/updatecart',[verifyToken],ctrls.updateCart)

router.put('/:_id',[verifyToken,isAdmin],ctrls.updateUserByAdmin)



module.exports = router
