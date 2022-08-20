const mazeRouter = require('express').Router()
const Maze = require('../model/Maze')
const User = require('../model/User')
const jwt = require('jsonwebtoken')
const getToken = (request)=>{
    let authorization = request.get('authorization')
    if(authorization && authorization.toLowerCase().startsWith('bearer')){
        return authorization.substring(7)
    }
    else{
        return false
    }
}
mazeRouter.post('/create',async(req,res)=>{
    console.log(req.body.maze)
    const token = getToken(req)
    if(!token){
        return res.status(400).send({message:"enter valid credentials"})
    }
    const decodedToken = jwt.verify(token,process.env.SECRET)
    if(!decodedToken){
        return res.status(400).send({message:"enter valid credentials"})
    }
    const user= await User.findById(decodedToken.id)
    const mazeString = JSON.stringify(req.body.maze)
    console.log(mazeString)
    const maze = new Maze({
        by: user.username,
        maze: mazeString,
        date: new Date()
    })
    await maze.save()
    user.maze=[...user.maze, maze._id]
    await user.save()
    return res.status(200).send({message:"done"})
})
mazeRouter.get('/',async(req,res)=>{
    const token = getToken(req)
    if(!token){
        return res.status(400).send({message:"enter valid credentials"})
    }
    const decodedToken = jwt.verify(token,process.env.SECRET)
    if(!decodedToken){
        return res.status(400).send({message:"enter valid credentials"})
    }
    const mazes = await Maze.find()
    return res.status(200).send({message:"mazes sent",maze:mazes})
})
module.exports= mazeRouter