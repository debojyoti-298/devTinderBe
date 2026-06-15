const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        required: true,
    unique: true
    },
    password:{
        type:String     
    },
    age:{
        type:Number
    },
    gender:{
        type:String
    },
});

const User = mongoose.model("User",userSchema);
module.exports = User;

//I can also write the above two lines in one line as below
// module.exports = mongoose.model("User",userSchema);