const express = require('express');
const app = express(); // This line says that I am creating a new express js application

// const {adminAuth, userAuth} = require ("./middlewares/auth.js");

const connectDB= require("./config/database.js");
const User = require("./models/user.js");

const validator = require("validator");

const cookieParser = require("cookie-parser");

const {validateSignUpData} = require("./utils/validation.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {userAuth} = require("./middlewares/auth.js");

app.use(express.json()); // This line says that I am using express json middleware to parse the incoming request body as JSON

app.use(cookieParser()); //without this method we can't parse the cookie for the validation inside server for the api which will call after doing login


const authRouter = require("./routes/auth.js");
const profileRouter = require("./routes/profile.js");
const requestRouter = require("./routes/request.js");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);



//This is the route handler for the signup route. It will save the user data to the database .
// app.post("/signup",async(req,res)=>{

//     console.log(req.body);
//     // const userObj = {
//     //     firstName:"Debojyoti",
//     //     lastName:"Das",
//     //     emailId:"debojyoti@das.com",
//     //     password:"debojyoti@123",
//     // }

//     // const user = new User({
//     //     firstName:"MS",
//     //     lastName:"Dhoni",
//     //     emailId:"ms@dhoni.com",
//     //     password:"ms@123",
//     // });


//     try{

//         console.log("Step 1");
//     //Validation of data when the Api hits through the postman
//     validateSignUpData(req);

//     console.log("Step 2");
//     const {firstName, lastName, emailId, password} = req.body;

//     console.log("Password:", password);

//     //Encrypt the password
//     const passwordHash = await bcrypt.hash(password, 10);
//     console.log(passwordHash);


//     //Creating a new instance of the User model
//     const user = new User({
//         firstName, lastName, emailId, password:passwordHash,
//     });

    
//         await user.save();
//         res.send("User signed up successfully");

//     }catch(err){
//         console.log("Error while saving user:", err);
//         res.status(500).send("Error occurred while signing up the user: "+err.message);

//     }
    
// })

// app.post("/login", async(req,res)=>{
//     try{

//         const {emailId,password} = req.body;
//         //Then I will put the check for emailId
//         // if(!validator.isEmail(emailId)){
//         //     throw new Error("Email is not valid");
//         // }

//         const user = await User.findOne({emailId:emailId});
//         if(!user){
//             throw new Error("Invalid Credentials");
//         }

//         // const isPasswordValid = await bcrypt.compare(password, user.password); //This user.password is the hash password
//         const isPasswordValid = await user.validatePassword(password);
//         if(isPasswordValid){

//             //Create a jwt token
//             const token = await user.getJWT();
//             // const token = await jwt.sign({_id:user._id},"DEV@TinderBE$2015",{ expiresIn: "1d"});
//             console.log(token);

//             //Add the token to cookie and sends the response back to the user
//             res.cookie("token",token,{expires:new Date(Date.now()+1*3600000)});
//             res.send("Login successful!!");
//         }else{
//             throw new Error("Invalid Credentials");
//         }

//     }catch(err){
//         res.status(400).send("Error:"+ err.message);

//     }
// })

// app.get("/profile", userAuth, async(req,res)=>{

//     try{
//     // //at first I need to validate this cookie
//     // const cookies = req.cookies;

//     // const {token} = cookies;

//     // if(!token){
//     //     throw new Error("Invalid token");
//     // }

//     // //validate my token
//     // const decodedMessage = await jwt.verify(token,"DEV@TinderBE$2015");

//     // const {_id}= decodedMessage;
//     // console.log("Logged in user is"+ _id);
//     // // console.log(cookies);
//     // const user = await User.findById(_id);
//     const user = req.user;

//     // if(!user){
//     //     throw new Error("User does not exist");
//     // }
//     res.send(user);
// }catch(err){
//     res.status(400).send("Error:"+err.message);
// }
// })


// app.post("/sendConnectionRequest", userAuth, async(req,res)=>{

//     const user = req.user;
//     //Sending a connection request
//     console.log("Sending a connection request");
//     res.send(user.firstName + " send the connection request");
// })




//This will give the user data based on the email id provided in the request body
// app.get("/user",async(req,res)=>{
//     const userEmail = req.body.emailId;
//     try{
//         const users = await User.find({emailId:userEmail});
//         if(users.length ===0){
//             return res.status(404).send("User not found")
//         }else{
//             res.send(users);

//         }
        
//     }
//     catch(err){
//         res.status(400).send("Something went wrong")
//     }
// })


//This will give the data of all the users in the database
// app.get("/feed",async(req,res) =>{
//     try{
//         const users = await User.find({});
//         res.send(users);

//     }catch(err){
//         res.status(400).send("Something went wrong");

//     }
// })



//Now we will see how do we delete a user from the database
// app.delete("/user",async(req,res)=>{
//     const userId = req.body.userId;
//     try{
//         const user = await User.findByIdAndDelete({_id:userId});
//         if(!user){
//             return res.status(404).send("User not found");
//         }else{
//             res.send("User deleted successfully");
//         }

//     }
//     catch(err){
//         res.status(400).send("Something went wrong");
//     }
// })



//Update the data of the user in the database
// app.patch("/user/:userId",async(req,res)=>{
//     const userId = req.params?.userId;
//     const data = req.body;

    
//     try{

//         const ALLOWED_UPDATES = ["photoUrl","about","gender","age","skills"];

//     const isUpdateAllowed = Object.keys(data).every(k=>ALLOWED_UPDATES.includes(k));
//     if(!isUpdateAllowed){
//         throw new Error("Update not allowed");
//     }

//     if(data?.skills.length>10){
//         throw new Error("Skills cannot be more than 10");
//     }
//        const user= await User.findByIdAndUpdate({_id:userId},data,{returnDocument:"before",runValidators:true,});
//        console.log("User data before update:", user);
//         res.send("User data updated successfully");

//     }catch(err){
//         res.status(400).send("Something went wrong:"+ err.message);

//     }
// })



connectDB()
.then(()=>{
    console.log("Database connected successfully");
    app.listen(7777, ()=>{
    console.log("Server is successfully running on port 7777")
});
})
.catch(err=>{
    console.error("Database cannot be connected..")
})

// app.use("/hello/2",(req,res)=>{
//     res.send("Abraka dabra");
// })

// app.use("/hello",(req,res)=>{
//     res.send("Hello hello hello!");
// })



//code of route handlers
// app.use("/user",
//     (req,res,next)=>{
//     console.log("Handling the route user");
//     // res.send("Response !!")
//     next();
// },
// (req,res)=>{
//     console.log("Handling the route user 2");
//     res.send("2nd Response !!")
// })





//This will only handle GET call to /user
// app.get("/user",(req,res)=>{
//     res.send({firstname:"Debojyoti", lastname:"Das"});
// })

// app.get(/^\/a(bc)??d$/, (req, res) => {
//     res.send("It will give response for /ad and /abcd");
// });
// app.get(/^\/ab*c$/, (req, res) => {
//     res.send("It will give response for /abc, /ac, /abbc, /abbbc and so on");
// });
// app.get(/^\/ab+c$/, (req, res) => {
//     res.send("It will give response for /abc, /abbc, /abbbc and so on");
// });
// app.get(/^\/ab?c$/, (req, res) => {
//     res.send("It will give response for /ac and /abc");
// });



// app.get("/user/:userId",(req,res) =>{
//     console.log(req.params);
//     res.send({firstname:"Debojyoti", lastname:"Das", params:req.params});
// })


// app.post("/user",(req,res)=>{
//     //saving data to DB
//     res.send("Data successfully saved to the database!");
// })


// app.delete("/user",(req,res)=>{
//     res.send("Deleted successfully");
// })

// app.use("/test",(req,res)=>{
//     res.send("Hello from the server");
// })



// app.get("/user",(req,res,next)=>{
//     console.log("First handler");
//     next();
// })

// app.get("/user",(req,res,next)=>{
//     console.log("First handler");
//     res.send("Response from the second handler");
// })




//Middlewares

// app.use("/admin",adminAuth);

// app.get("/user",userAuth, (req,res)=>{
//     res.send("User data sent")
// })
// app.get("/admin/getAllData",(req,res)=>{
//      res.send("All data sent");
    
// })
// app.get("/admin/deleteUser",(req,res)=>{
//      res.send("User deleted successfully");   
// })



//Error handling middleware
// app.get("/getUserData",(req,res)=>{

//     throw new Error("vfvhsgjgjgj");

//     //Logic of DB call and get user data
//     res.send("User data sent");
// });




//By try..catch method
// app.get("/getUserData",(req,res)=>{
//     try{
//         throw new Error("vfvhsgjgjgj");
//         res.send("User data sent");
//     }
//     catch(err){
//         res.status(500).send(`Some error contact support team ${err.message}`);
//     }
// });



//Which error will be handling here
// app.use("/",(err,req,res,next)=>{
//     if(err){
//         res.status(500).send("Internal Server Error 1");
//     }
// })

// app.get("/getUserData",(req,res)=>{
//     throw new Error("vfvhsgjgjgj");
//     //Logic of DB call and get user data
//     res.send("User data sent");
// });

// app.use("/",(err,req,res,next)=>{
//     if(err){
//         res.status(500).send(`Internal Server Error 2: ${err.message}`);
//     }
// })




// app.use("/",(req,res)=>{
//     res.send("Hello from the dashboard!");
// })
// app.listen(7777, ()=>{
//     console.log("Server is successfully running on port 7777")
// });