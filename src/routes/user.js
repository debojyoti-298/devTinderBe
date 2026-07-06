const express= require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");


//This api will Get all the pending connection request for the loggedInUser 
userRouter.get("/user/requests/received", userAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user;      

        //Here the find() method will return a array of all objects, if it was findOne() method then it will be an object
        const connectionRequests = await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:"interested",
        }).populate("fromUserId",["firstName", "lastName", "photoUrl", "age", "gender", "about", "skills"]);

        res.json({message:"Data fetched successfully",
            data: connectionRequests
        })

    }catch(err){
        res.status(400).send("Error:" + err.message)

    }
})

//This api will show us the information about the matched connections
userRouter.get("/user/connections", userAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user;

        //Here this find() method will give the output with array
        const connectionRequests = await ConnectionRequest.find({
            $or:[
                {toUserId:loggedInUser._id, status:"accepted"},
                {fromUserId:loggedInUser._id, status:"accepted"}
            ]

        }).populate("fromUserId", ["firstName", "lastName", "photoUrl", "age", "gender", "about", "skills"]).populate("toUserId",["firstName", "lastName", "photoUrl", "age", "gender", "about", "skills"]);

        //This below code of data only give data for the fromUserId row
        const data = connectionRequests.map((row) => {
            if(row.fromUserId._id.toString()===loggedInUser._id.toString()){
                //Here I have done the string comparison inside the objectId
                return row.toUserId;
            }else{
                return row.fromUserId;
            }
        });

        res.json({data});

    }catch(err){
        res.status(404).send("Error:" + err.message);
    }
})

//Now we will work on feed api that means when we will open tinder page we will see some users list , so that is the feed
userRouter.get("/feed", userAuth, async(req, res)=>{
try{

    //User should see all the user cards except
      //his own card
      //People with whom he has already connected
      //People whom I have already ignored
      //People whom I have already sent the connection request
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
     limit = limit>50? 50:limit;
    const skip = (page - 1)*limit;

    //Find all the connection requests that I have sent and received
    const connectionRequests = await ConnectionRequest.find({
        $or:[
            {fromUserId:loggedInUser._id},
            {toUserId: loggedInUser._id}
        ],
    }).select("fromUserId toUserId");
    // }).select("fromUserId toUserId").populate("fromUserId" ,["firstName"]).populate("toUserId", ["firstName"]);

    //Now I will hide the upper connectionRequests users from the feed because some actions status has already been taken
    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req)=>{
        hideUsersFromFeed.add(req.fromUserId.toString());
        hideUsersFromFeed.add(req.toUserId.toString());

    })
    console.log(hideUsersFromFeed);

    //Now we will find the users who are apart from "hideUsersFromFeed" and also apart from my own id
    // here $nin means not in and by using Array.from I'm converting "hideUsersFromFeed" Set to the Array . Here $ne means not equal
    const users = await User.find({
        $and:[{ _id:{$nin: Array.from(hideUsersFromFeed)}},
            {_id:{$ne:loggedInUser._id}},
        ]
       ,
    }).select("firstName lastName photoUrl about skills").skip(skip).limit(limit);

    // res.send(connectionRequests);
    res.json({data: users});

}catch(err){
 res.status(400).json({ message:err.message});
}
})

module.exports = userRouter;