import express from 'express'
import cors from 'cors'
import {MongoClient} from 'mongodb'
import dotenv from "dotenv";
import joi from 'joi'
import dayjs from 'dayjs'

console.log(dayjs().format('HH:MM:ss'))

const tempo=dayjs()

dotenv.config()

const server = express()
server.use(cors())
server.use(express.json())

const MongoCliente= new MongoClient(process.env.MONGO_URI)
let db

MongoCliente.connect().then(()=>{
    db=MongoCliente.db('test')
})

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



server.get('/participants', async (req,res)=>{
    
    try{
        const participantes = await db.collection('participants').find().toArray()
        console.log(participantes)
        res.send(participantes)
    }catch(error){
        res.status(444).send()
        return
    }
    
    
})

server.post('/participants', async (req,res)=>{
    const name = req.body
    console.log(name)
    const validation = nameSchema.validate(name, { abortEarly: true });
    const verificarNome= await db.collection('participants').findOne({name:name.name})
    console.log(verificarNome)
    if(!verificarNome){
       console.log('diferente')
    }else{
         res.status(409).send('Esse nome já foi cadastrado !')
         return
    }
    if(validation.error){
        res.status(422).send(validation.error.details[0].message)
        return
    }
     db.collection('participants').insertOne({
        name:name.name,
       lastStatus: Date.now(),
    })
     db.collection('messages').insertOne({
        from: name.name, 
        to: 'Todos', 
        text: 'entra na sala...', 
        type: 'status', 
        time: tempo.format('HH:MM:ss')
    })

    res.status(201).send()

})

server.post('/messages', async(req,res)=>{
   
    const {user} = req.headers
    const {to,text,type}=req.body
     const message={from:user,
                    to:to,
                    text:text,
                    type:type,
                    time:tempo.format('HH:MM:ss')}
    
    const message1Schema=joi.object({
        from: joi.string(), 
        to: joi.string(), 
        text: joi.string().required(), 
        type: joi.string().valid("message", "private_message").required(),
        time: joi.string(),
    })

    const validation= message1Schema.validate(message,{abortEarly: true})
    const verificarNome= await db.collection('participants').findOne({name:message.from})
    console.log(verificarNome)
    if(validation.error && !verificarNome){
        res.status(422).send(validation.error.details)
        return
    }else{
        db.collection('messages').insertOne(message)
        res.status(201).send()
        return
    }

    
    

  

   // console.log(message)





})

server.get('/messages', async (req,res)=>{
    const limit = Number(req.query.limit)
    const {user} = req.headers


    if(limit === NaN){
        try{
            const messages = await db.collection('messages').find().toArray()
            const messagesFilter=messages.filter(message=>{
                                                            const{to,from,type}=message                                                                     
                                                            const userSelected = from === user || to === 'Todos' || to === user || type === 'message'
                                                            return userSelected
                                                        })
            console.log(messagesFilter)                            
            res.send(messagesFilter)
        }catch(error){
            res.status(444).send()
            return
        }
    }else{
        try{
        const messages= await db.collection('messages').find().toArray()
        const messagesFilter=messages.filter(message=>{
            const{to,from,type}=message                                                                     
            const userSelected = from === user || to === 'Todos' || to === user || type === 'message'
            return userSelected
        })
        const M=messagesFilter.slice(-limit)
        res.send(M)
    }catch(error){
        res.status(445).send()
            return
    }
    }
})

server.get('/status', async (req,res)=>{
    const {user} = req.headers

    res.send('ok')
})


server.listen(5000)

