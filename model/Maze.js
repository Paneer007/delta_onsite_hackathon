const mongoose = require('mongoose')
const mazeSchema = mongoose.Schema({
    by:String,
    maze:String,
    date:Date
})
module.exports= mongoose.model('Maze',mazeSchema)