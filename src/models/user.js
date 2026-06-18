const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:4,
        maxLength:20
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        unique:true,
        lowercase:true,
        required: true,
        trim:true
    
    },
    password:{
        type:String,
        required:true,    
    },
    age:{
        type:Number,
        min:18,
    },
    gender:{
        type:String,
        validate(value){
            if(!["Male","Female","Others"].includes(value)){
                throw new Error("Gender data is not valid");

            }
        },
    },
    photoUrl:{
        type:String,
        default:"https://smsdelhibmw.co.in/wp-content/uploads/2022/02/User-Profile-PNG.png"
    },
    about:{
        type:String,
        default:"This is a default about of the user!"
    },
    skills:{
        type:[String]
    }
},
{
    timestamps:true,
});

const User = mongoose.model("User",userSchema);
module.exports = User;

//I can also write the above two lines in one line as below
// module.exports = mongoose.model("User",userSchema);