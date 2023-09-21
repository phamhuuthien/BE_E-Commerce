const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var procductSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim : true
    },
    slug:{
        type:String,
        unique:true,
        lowercase:true
    },
    description:{
        type:String,
        required:true,
    },
    brand:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    // hạn mục
    category:{
        type: mongoose.Types.ObjectId,
        ref: 'Category'
    },
    quantity:{
        type:Number,
        default: 0
    },
    // mặc hàng đã bán
    sold:{
        type:Number,
        default: 0
    },
    images:{
        type : Array
    },
    color:{
        type: String,
        enum : ['Black','Grown','Red']
    },
    // đánh giá
    ratings: [
        {
            star : {type : Number},
            postedBy : {type : mongoose.Types.ObjectId, ref:'User'},
            comment : {type : String}
        }
    ],
    totalRatings : {
        type : Number,
        default: 0
    }
},{
    timestamps : true
});

//Export the model
module.exports = mongoose.model('Product', procductSchema);