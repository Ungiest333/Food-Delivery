const mongoose = require('mongoose');

function connectDB(){
   mongoose.connect(process.env.MONGODB_URI)
   .then(()=>{
    console.log("Mongodb Connected")
   })
   .catch((err)=>{
    console.log('Mongodb Connected Error', err);

   })
}
module.exports = connectDB;