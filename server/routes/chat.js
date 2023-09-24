const router = require('express').Router();
const crtls = require('../controller/chat')
const {verifyToken, isAdmin} = require('../middlewares/verifyToken')
const {socket} = require('../config/socket.io')

router.post('/',verifyToken, socket)

module.exports = router