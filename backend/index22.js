import express from "express"
import users from "./user.js"

const app = express()

app.get("/",(req,res)=>{
    res.send("Server is up!")
})

app.get("/api/user",(req,res)=>{
    res.send(users)
})

const port = process.env.PORT || 8080

app.listen(port,()=>{
    console.log(`http:localhost:${port}`)
})