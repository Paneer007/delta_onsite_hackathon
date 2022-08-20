const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    username:String,
    password:String,
    maze:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Maze"
    }]
})
module.exports = mongoose.model('User',userSchema)