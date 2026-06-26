const express = require("express");

const requestRouter = express.Router();
const {userAuth} = require("../middlewares/auth.js");

const ConnectionRequest = require("../models/connectionRequest.js");

const User = require("../models/user.js");

requestRouter.post("/request/send/:status/:toUserId", userAuth, async(req,res)=>{

    //Here as "userAuth" is present that means user is already logged in

    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored","interested"];

        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"Invalid status type " + status})
        }

        //Check if there is already existing connection request in between them
        const existingConnectionRequest = await ConnectionRequest.findOne({
            //This is the process of giving the condition of mongodb through an array
            $or:[{fromUserId, toUserId}, {fromUserId:toUserId, toUserId:fromUserId}],
        })

        if(existingConnectionRequest){
           return res.status(400).send({message: "Connection request already exists"})
        }

        const toUser = await User.findById(toUserId);
        if(!toUser){
            res.status(404).json({message:"User not found",})
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId, toUserId, status
        });

        const data = await connectionRequest.save();

        res.json({message:req.user.firstName + " is " + status + " in " + toUser.firstName, data})

   }
    catch(err){
        res.status(400).send("Error :" + err.message)
    }

})


module.exports = requestRouter;