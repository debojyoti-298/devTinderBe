const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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

userSchema.methods.getJWT = async function(){
//Don't make this function as an arrow function otherwise you will get an error, and here we are creating the jwt token instead creating inside the app.js file
    const user = this;
    const token = await jwt.sign({_id:user._id},"DEV@TinderBE$2015",{ expiresIn: "1d"});
    return token;

};

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const passwordHash= user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser,passwordHash);
    return isPasswordValid;
}
const User = mongoose.model("User",userSchema);
module.exports = User;

//I can also write the above two lines in one line as below
// module.exports = mongoose.model("User",userSchema);