const jwt = require("jsonwebtoken");
const User = require("../models/user");


// const adminAuth = (req,res,next)=>{
//     console.log("Admin auth is getting checked")
//     const token = "xyz";
//     const isAdminAuthorized = token ==="xyz";
//     if(!isAdminAuthorized){
//         res.status(401).send("Unauthorized request");
//     }else{
//         next();
//     }
// };

//Similarly we can create userAuth   

// const userAuth = (req,res,next)=>{
//     console.log("User auth is getting checked")
//     const token = "xyzabc";
//     const isUserAuthorized = token ==="xyz";
//     if(!isUserAuthorized){
//         res.status(401).send("Unauthorized request");
//     }else{
//         next();
//     }
// };

const userAuth = async(req,res,next)=>{

    try{
    //Step:- Read the token from the req cookies
    const cookies = req.cookies;
    const {token} = cookies;
    if(!token){
        return res.status(401).json({message:"Please login"});
    }

    const decodedObj = await jwt.verify(token,process.env.JWT_SECRET);

    const {_id} = decodedObj;
    const user = await User.findById(_id);
    if(!user){
        throw new Error("User not found");
    }

    req.user = user;
    next();
}catch(err){
    res.status(400).send("Error:" + err.message)
}

}


// module.exports = { adminAuth, userAuth}; 
module.exports = {userAuth}; 