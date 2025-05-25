const mongoose = require('mongoose')

const account = mongoose.Schema({
    contact: Number,
    password: String,
})

module.exports = mongoose.model('account',account)