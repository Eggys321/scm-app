require("dotenv/config")
const express = require("express");
const app = express();
const port = process.env.PORT || 4545;
const morgan = require("morgan");
const cors = require("cors");
const connect = require('./config/DB');
const auth = require('./routes/authRoutes');
const taskRouter = require('./routes/postRoutes')


// custom middlewares
app.use(express.json())
app.use(morgan("dev"));
app.use(cors())


// Api's
app.use('/api/v1/auth',auth);
app.use('/api/v1',taskRouter)


// Server and DB connection
connect()
.then(()=>{
    try {
        app.listen(port,(req,res)=>{
            console.log(`server is connected to http://localhost:${port}`);
        })
    } catch (error) {
        console.log('can not connect to the server');
    }
})
.catch((error)=>{
    console.log("invalid database connection...", error);
});




// Routes
app.get('/',(req,res)=>{
    res.status(200).json({message:'app is running'})
})
app.use((req,res)=>{
    res.status(404).json({message:'route doesnt exist'})
})


