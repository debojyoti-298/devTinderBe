const mongoose = require("mongoose");
const validator = require("validator");

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
        trim:true,
        validate(value){
            if(!validator.isEmail(value))
            {
            throw new Error("Invalid email address" + value);

            }
        }
    
    },
    password:{
        type:String,
        required:true,   
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong password:" + value);

            }
        }, 
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
        default:"https://smsdelhibmw.co.in/wp-content/uploads/2022/02/User-Profile-PNG.png",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid photo URL:" + value);

            }
        },
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