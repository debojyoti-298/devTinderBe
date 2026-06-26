//This model will define the connection schema/model between two users
const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({

    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
    },

    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
    },

    status:{
        type:String,
        required:true,
        enum:{
            values:["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type`
        }
    }

})

//Creating the index
connectionRequestSchema.index({fromUserId:1, toUserId:1}); //This is compound index



//Before I save this into the DB this pre function will be called , so this is kind of a validation before saving
connectionRequestSchema.pre("save", function(){
    const connectionRequest = this;

    //Check if the fromUserId is same as toUserId
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send connection request to yourself");
        next(); //Never forget to call next() here because it is a middleware
    }


})

const ConnectionRequestModel = mongoose.model("ConnectionRequest",connectionRequestSchema); 

module.exports = ConnectionRequestModel;