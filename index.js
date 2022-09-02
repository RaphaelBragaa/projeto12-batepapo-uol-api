import express from 'express'
import cors from 'cors'
import {MongoClient} from 'mongodb'
import dotenv from "dotenv";
import joi from 'joi'


dotenv.config()

const server = express()
server.use(cors())
server.use(express.json())

const MongoCliente= new MongoClient(process.env.MONGO_URI)

const participantDBschema=joi.object({
    name:joi.string().required,
    lastStatus:joi.number().required,
})

const messageDBschema=joi.object({
    from: joi.string().required, 
    to: joi.string().required, 
    text: joi.string().required, 
    type: joi.string().required, 
    time: joi.string().required,
})

const messageSchema=joi.object({
    to: joi.string().required, 
    text: joi.string().required, 
    type: joi.string().required, 
})
const nameSchema=joi.object({name:joi.string()})

const names=[]


server.get('/participants',(req,res)=>{
    res.send(names)
})

server.post('/participants', async (req,res)=>{
    const name = req.body
    const validation = nameSchema.validate(name, { abortEarly: true });
    
    if(validation.error){
        res.status(422).send(validation.error.details[0].message)
        return
    }


    
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

