// !mdbgum
const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt');
const crypto =  require("crypto");
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        default:"user",
    },
    cart:[
        {
            product : {type : mongoose.Types.ObjectId, ref : 'Product'},
            quantity : Number ,
            color : String 
        }
    ],
    address: String,
    // luu sản phẩm yêu thích
    wishist : {type : mongoose.Types.ObjectId, ref:'Product'},
    isBlocked : {type : Boolean, default:false},
    refreshToken : {type : String},
    // 
    passwordChangedAt :{type : String},
    // tạo ra token sau đó gửi cho người dùng khi quên mật khẩu . Người dùng cần gửi lên lại token nếu matches thì cho người dùng đổi
    passwordResetToken : {type : String},
    // thời gian sống token admin gửi cho user sau khi người dùng quên mật khẩu
    passwordResetExpires : {type : String}
},{
    timestamps : true
});

//  pre : trước khi lưu thì làm gì
userSchema.pre("save", async function(next){
    //  nếu password không có sự thay đổi thì không cần lưu lại
    if(!this.isModified()){
        next();
    }
    const salt = bcrypt.genSaltSync(10)
    this.password = await bcrypt.hash(this.password,salt)
})

// định nghĩa ra các hamf
// hàm so sánh password

userSchema.methods = {
    isCorrectPassword : async function(password) {
        return bcrypt.compare(password,this.password)
    },
    createPasswordChangedToken : function(){
        // random ra 1 buffer rồi chuyển sang string dạng hex
        // trả về cho người dùng và chưa hash 
        const resetToken = crypto.randomBytes(32).toString('hex');
        // tạo ra 1 token
        // hash lưu vào DB
        this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        // set thời gian sống của token
        this.passwordResetExpires = Date.now()+15*60*1000
        return resetToken
    }
}

//Export the model
module.exports = mongoose.model('User', userSchema);