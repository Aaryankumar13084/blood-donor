const mongoose = require('mongoose')

const donor = new  mongoose.Schema({
    name:String,
    tehsil:String,
    bloodgroup:String,
    village: String,
    contact:Number,
    Whatsapp: Number,
    password: String,
   date:{
       type:Date,
       default:Date.now
   }
})

module.exports = mongoose.model('donors',donor)