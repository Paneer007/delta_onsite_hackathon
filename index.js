const http = require('http')
const app = require('./app')
const server = http.createServer(app)
const PORT = process.env.port || 3001
server.listen(PORT,()=>{
    console.log("Server running on PORT:",PORT)
})