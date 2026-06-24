const express = require("express");

const profileRouter = express.Router();

const {userAuth} = require("../middlewares/auth.js");

profileRouter.get("/profile", userAuth, async(req,res)=>{

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

module.exports = profileRouter;