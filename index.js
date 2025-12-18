require('dotenv').config();
const express = require("express")
const mongoose = require('mongoose')
const cors = require('cors')
const userRouter = require("./routes/userRouter")
const app = express()
mongoose.connect(process.env.URI).then(()=>{
    app.listen(process.env.PORT)
    console.log("Data base connected successfully")
}).catch((err)=>{
    console.log("Error while connecting the database",err)
})
app.use(express.json())
app.use(cors())
app.use('/',userRouter)
