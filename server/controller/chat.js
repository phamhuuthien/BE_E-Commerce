const Blog = require('../model/blog')
const asyncHandler = require('express-async-handler')


const saveMessage = asyncHandler(async()=>{
    const {_id} = user
    const {message} = req.body
    const newMessage = new Chat({ _id, message });
    const response = await newMessage.save(); 
    return res.status(200).json({
        succees : response ? true : false,
        rs : response ? true : "can not send message"
    })
})


module.exports ={
    saveMessage
}