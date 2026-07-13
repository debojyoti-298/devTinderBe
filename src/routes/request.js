const express = require("express");

const requestRouter = express.Router();
const {userAuth} = require("../middlewares/auth.js");

const ConnectionRequest = require("../models/connectionRequest.js");

const User = require("../models/user.js");

const sendEmail = require("../utils/sendEmail.js");

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
            return res.status(404).json({message:"User not found"});
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId, toUserId, status
        });

        const data = await connectionRequest.save();

        const emailRes = await sendEmail.run(toUser.emailId, "A new friend request from" + req.user.firstName, req.user.firstName + " is " + status + " in " + toUser.firstName, data);
        console.log(emailRes);


        // const emailRes = await sendEmail.run("A new friend request from" + req.user.firstName, req.user.firstName + " is " + status + " in " + toUser.firstName, data);
        // console.log(emailRes);

        res.json({message:req.user.firstName + " is " + status + " in " + toUser.firstName, data})

   }
    catch(err){
        res.status(400).send("Error :" + err.message)
    }

})

requestRouter.post("/request/review/:status/:requestId",userAuth, async(req,res)=>{
    try{
        const loggedInUser= req.user;
        const {status,requestId} = req.params;

        //Validate the status
        const allowedStatus = ["accepted","rejected"];
        if(!allowedStatus.includes(status)){
            return res.send(400).json({message:"Status not allowed!"});
        }

        //Now we will check whether the requestId is present in the DB or not and also check about the toUserId is equal with loggedInUser and status is interested
        const connectionRequest = await ConnectionRequest.findOne({
            _id:requestId,
            toUserId: loggedInUser._id,
            status:"interested",
        
        });

        if(!connectionRequest){
            return res.status(404).json({message:"Connection request not found"});
        }

        //After doing the upper process right now I'm safe to change the status
        connectionRequest.status= status;
        const data = await connectionRequest.save();

        res.json({message:"Connection request "+ status , data});


        //Now we will check whether the receiver person logged in , so the logged in user is the toUserId
        

        // Then the status should be interested from the sender so that receiver can accepted and rejected the request

        //requestId should be valid

    }catch(err){
        res.status(400).send("Error :" + err.message);
    }
})

module.exports = requestRouter;