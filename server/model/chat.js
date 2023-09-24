const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var chatSchema = new mongoose.Schema({
    name:{
        type: mongoose.Types.ObjectId,
        ref : 'User'
    },
    message:{
        type:String,
        required:true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
},{timestamp: true});

//Export the model
module.exports = mongoose.model('Chats', chatSchema);