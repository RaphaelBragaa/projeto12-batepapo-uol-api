import express from 'express'
import cors from 'cors'

const server = express()
server.use(cors())
server.use(express.json())


server.get('/participants',(req,res)=>{
    res.send('OK')
})
server.post('/participants',(req,res)=>{
    res.send('ok')
})

server.post('/messages',(req,res)=>{
    res.send('ok')
})

server.get('/status',(req,res)=>{
    res.send('ok')
})


server.listen(5000)

