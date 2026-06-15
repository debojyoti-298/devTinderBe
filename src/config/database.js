const mongoose = require('mongoose');

const connectDB= async()=>{
    await mongoose.connect("mongodb+srv://namastedev:p6xrxCXwB6Q1myaB@namastenode.q2psxe2.mongodb.net/devTinderBE");
}

module.exports = connectDB;
