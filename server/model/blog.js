const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true
    },
    numberViews:{
        type:Number,
        default : 0
    },
    likes :[
        {
            type: mongoose.Types.ObjectId,
            ref : 'User'
        }
    ],
    dislikes :[
        {
            type: mongoose.Types.ObjectId,
            ref : 'User'
        }
    ],
    image : {
        type : String,
        default : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROJmGQU-YJkAWvjqyS0zA6Ul5zqRPNBK_8YA&usqp=CAU'
    },
    author : {
        type : String,
        default : 'Admin'
    }
},{
    timestamps : true,
    // set được key virtuals mặc dù không định nghĩa trong Object
    //  chỉ chạy khi gọi Json
    toJSON : { virtuals : true},
    //  chỉ chạy khi gọi Object
    toObject : { virtuals : true}
});

//Export the model
module.exports = mongoose.model('Blog', blogSchema);