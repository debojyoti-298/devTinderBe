const express = require('express');
const app = express(); // This line says that I am creating a new express js application

// app.use("/hello/2",(req,res)=>{
//     res.send("Abraka dabra");
// })

// app.use("/hello",(req,res)=>{
//     res.send("Hello hello hello!");
// })

//This will only handle GET call to /user
app.get("/user",(req,res)=>{
    res.send({firstname:"Debojyoti", lastname:"Das"});
})


app.post("/user",(req,res)=>{
    //saving data to DB
    res.send("Data successfully saved to the database!");
})


app.delete("/user",(req,res)=>{
    res.send("Deleted successfully");
})

app.use("/test",(req,res)=>{
    res.send("Hello from the server");
})

// app.use("/",(req,res)=>{
//     res.send("Hello from the dashboard!");
// })
app.listen(7777, ()=>{
    console.log("Server is successfully running on port 7777")
});