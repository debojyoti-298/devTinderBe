const express = require("express");

const profileRouter = express.Router();

const User = require("../models/user.js");

const {userAuth} = require("../middlewares/auth.js");

const {validateEditProfileData} = require("../utils/validation.js");


//Here userAuth will require because for getting the user I need to be logged in
profileRouter.get("/profile/view", userAuth, async(req,res)=>{

    try{
    // //at first I need to validate this cookie
    // const cookies = req.cookies;

    // const {token} = cookies;

    // if(!token){
    //     throw new Error("Invalid token");
    // }

    // //validate my token
    // const decodedMessage = await jwt.verify(token,"DEV@TinderBE$2015");

    // const {_id}= decodedMessage;
    // console.log("Logged in user is"+ _id);
    // // console.log(cookies);
    // const user = await User.findById(_id);
    const user = req.user;

    // if(!user){
    //     throw new Error("User does not exist");
    // }
    res.send(user);
}catch(err){
    res.status(400).send("Error:"+err.message);
}
})

profileRouter.patch("/profile/edit",userAuth, async(req,res)=>{
    try{
       if(!validateEditProfileData(req)){
        throw new Error("Invalid Edit Request!");
       } ;

    //    const user = req.user; //This user is the same user which has been attached by middleware
       const loggedInUser = req.user; //This loggedInUser is the same user which has been attached by middleware and upper line is the same

        console.log(loggedInUser);
       Object.keys(req.body).forEach((key)=>(loggedInUser[key]= req.body[key]));
       console.log(loggedInUser);

       await loggedInUser.save();

    //    res.send(`${loggedInUser.firstName}, your profile updated successfully`);
       res.json({message: `${loggedInUser.firstName}, your profile updated successfully`,
    data: loggedInUser});

    }catch(err){
        res.status(400).send("Error:"+err.message);
    }

})

// Change password for logged-in users
profileRouter.patch("/profile/password",userAuth, async(req,res)=>{
    try{
        const {currentPassword, newPassword} = req.body;
        const user = req.user;

        // Validate input
        if(!currentPassword || !newPassword){
            throw new Error("Current password and new password are required");
        }

        // Check if new password is strong
        if(!require("validator").isStrongPassword(newPassword)){
            throw new Error("New password is not strong enough");
        }

        // Verify current password
        const isPasswordValid = await user.validatePassword(currentPassword);
        if(!isPasswordValid){
            throw new Error("Current password is incorrect");
        }

        // Hash and update new password
        const bcrypt = require("bcrypt");
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({message: "Password changed successfully"});
    }catch(err){
        res.status(400).send("Error: " + err.message);
    }
})

// Forgot password - send reset link (basic implementation)
profileRouter.post("/auth/forgot-password", async(req,res)=>{
    try{
        const {emailId} = req.body;
        
        if(!emailId){
            throw new Error("Email is required");
        }

        const User = require("../models/user");
        const user = await User.findOne({emailId});
        
        if(!user){
            throw new Error("User with this email does not exist");
        }

        // Generate reset token (valid for 1 hour)
        const resetToken = require("crypto").randomBytes(32).toString("hex");
        const resetTokenHash = require("crypto").createHash("sha256").update(resetToken).digest("hex");
        const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        // Save token and expiry to user (NOTE: Add resetToken and resetTokenExpiry fields to User model)
        user.resetToken = resetTokenHash;
        user.resetTokenExpiry = tokenExpiry;
        await user.save();

        // In a real app, send email with reset link
        // const resetLink = `http://yourfrontend.com/reset-password?token=${resetToken}&email=${emailId}`;
        // Send email via nodemailer

        res.json({
            message: "Password reset link sent to your email",
            // For testing only - remove in production
            resetToken: resetToken
        });

    }catch(err){
        res.status(400).send("Error: " + err.message);
    }
})

// Reset password using token (called from forgot password link)
profileRouter.patch("/auth/reset-password", async(req,res)=>{
    try{
        const {emailId, resetToken, newPassword} = req.body;

        if(!emailId || !resetToken || !newPassword){
            throw new Error("Email, reset token, and new password are required");
        }

        // Check if new password is strong
        if(!require("validator").isStrongPassword(newPassword)){
            throw new Error("New password is not strong enough");
        }

        const User = require("../models/user");
        const resetTokenHash = require("crypto").createHash("sha256").update(resetToken).digest("hex");

        const user = await User.findOne({
            emailId,
            resetToken: resetTokenHash,
            resetTokenExpiry: {$gt: Date.now()}
        });

        if(!user){
            throw new Error("Invalid or expired reset token");
        }

        // Hash and update new password
        const bcrypt = require("bcrypt");
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetToken = null;
        user.resetTokenExpiry = null;
        await user.save();

        res.json({message: "Password reset successfully"});

    }catch(err){
        res.status(400).send("Error: " + err.message);
    }
})

module.exports = profileRouter;