const express = require('express');
const app = express(); // This line says that I am creating a new express js application

const {adminAuth, userAuth} = require ("./middlewares/auth.js");

const connectDB= require("./config/database.js");
const User = require("./models/user.js");




app.post("/signup",async(req,res)=>{
    // const userObj = {
    //     firstName:"Debojyoti",
    //     lastName:"Das",
    //     emailId:"debojyoti@das.com",
    //     password:"debojyoti@123",
    // }

    const user = new User({
        firstName:"Sachin",
        lastName:"Tendulkar",
        emailId:"sachin@tendulkar.com",
        password:"sachin@123",
    });

    try{
        await user.save();
        res.send("User signed up successfully");

    }catch(err){
        res.status(500).send("Error occurred while signing up the user"+err.message);

    }
    
})



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