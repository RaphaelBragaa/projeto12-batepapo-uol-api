import express from 'express'
import cors from 'cors'
import {MongoClient} from 'mongodb'
import dotenv from "dotenv";


dotenv.config()

const server = express()
server.use(cors())
server.use(express.json())

const MongoCliente= new MongoClient(process.env.MONGO_URI)

console.log(MongoCliente)

const names=[]


server.get('/participants',(req,res)=>{
    res.send(names)
})
server.post('/participants',(req,res)=>{
    const name = req.body
    names.push(name)

    res.send(names)
})

server.post('/messages',(req,res)=>{
    res.send('ok')
})

server.get('/status',(req,res)=>{
    res.send('ok')
})


server.listen(5000)

