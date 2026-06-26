const express = require("express");

const authRouter = express.Router();
const User = require("../models/user.js");
const {validateSignUpData} = require("../utils/validation.js");
const bcrypt = require("bcrypt");
const { now } = require("mongoose");

authRouter.post("/signup",async(req,res)=>{

    console.log(req.body);
    // const userObj = {
    //     firstName:"Debojyoti",
    //     lastName:"Das",
    //     emailId:"debojyoti@das.com",
    //     password:"debojyoti@123",
    // }

    // const user = new User({
    //     firstName:"MS",
    //     lastName:"Dhoni",
    //     emailId:"ms@dhoni.com",
    //     password:"ms@123",
    // });


    try{

        console.log("Step 1");
    //Validation of data when the Api hits through the postman
    validateSignUpData(req);

    console.log("Step 2");
    const {firstName, lastName, emailId, password} = req.body;

    console.log("Password:", password);

    //Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);


    //Creating a new instance of the User model
    const user = new User({
        firstName, lastName, emailId, password:passwordHash,
    });

    
        await user.save();
        res.send("User signed up successfully");

    }catch(err){
        console.log("Error while saving user:", err);
        res.status(500).send("Error occurred while signing up the user: "+err.message);

    }
    
})

authRouter.post("/login", async(req,res)=>{
    try{

        const {emailId,password} = req.body;
        //Then I will put the check for emailId
        // if(!validator.isEmail(emailId)){
        //     throw new Error("Email is not valid");
        // }

        const user = await User.findOne({emailId:emailId});
        if(!user){
            throw new Error("Invalid Credentials");
        }

        // const isPasswordValid = await bcrypt.compare(password, user.password); //This user.password is the hash password
        const isPasswordValid = await user.validatePassword(password);
        if(isPasswordValid){

            //Create a jwt token
            const token = await user.getJWT();
            // const token = await jwt.sign({_id:user._id},"DEV@TinderBE$2015",{ expiresIn: "1d"});
            console.log(token);

            //Add the token to cookie and sends the response back to the user
            res.cookie("token",token,{expires:new Date(Date.now()+1*3600000)});
            res.send("Login successful!!");
        }else{
            throw new Error("Invalid Credentials");
        }

    }catch(err){
        res.status(400).send("Error:"+ err.message);

    }
})

authRouter.post("/logout",async(req,res)=>{
    res.cookie("token",null,{expires: new Date(Date.now()),});
    res.send("Logged out successfully")

})
module.exports = authRouter;