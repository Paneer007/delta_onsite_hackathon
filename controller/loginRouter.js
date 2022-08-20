const loginRouter = require('express').Router()
const User = require('../model/User')
const bcrypt = require('bcrypt')
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
loginRouter.post('/',async(req,res)=>{
    const body = req.body
    console.log(body)
    if(!(body.password&& body.username)){
        return res.status(400).send({message:"enter valid username and password"})
    }
    let user = await User.findOne({username:body.username}).populate('maze')
    if(!user){
        return res.status(400).send({message:"Enter valid username and password"})
    }
    const passConfirm = bcrypt.compare(body.password,user.password)
    if(!passConfirm){
        return res.status(400).send({message:"wrong password pa"})
    }
    const tokenBody ={id:user._id,username:user.username}
    const jwtToken = jwt.sign(tokenBody,process.env.SECRET)
    return res.status(200).send({message:"logged in created",token:jwtToken,user:user})
})
loginRouter.get('/updated',async(req,res)=>{
    const token = getToken(req)
    if(!token){
        return res.status(400).send({message:"enter valid credentials"})
    }
    const decodedToken = jwt.verify(token,process.env.SECRET)
    if(!decodedToken){
        return res.status(400).send({message:"enter valid credentials"})
    }
    const user= await User.findById(decodedToken.id).populate('maze')
    return res.status(200).send({message:"updated Data",user:user})
})
loginRouter.post('/addmaze',async(req,res)=>{
    const token = getToken(req)
    const body = req.body
    if(!token){
        return res.status(400).send({message:"enter valid credentials"})
    }
    const decodedToken = jwt.verify(token,process.env.SECRET)
    if(!decodedToken){
        return res.status(400).send({message:"enter valid credentials"})
    }
    const user= await User.findById(decodedToken.id)
    user.maze=[...user.maze, body.id]
    await user.save()
    return res.send(200).send({message:"updated Data"})
})
module.exports = loginRouter