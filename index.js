const express=require('express')
const mongoose =require('mongoose')
const bodyParser =require("body-parser")
const dotenv=require('dotenv')


const app=express();
dotenv.config();
const port =process.env.PORT || 3001;

const username=process.env.MONGODB_USERNAME;
const password=process.env.MONGODB_PASSWORD;
mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.owhytft.mongodb.net/?retryWrites=true&w=majority`)

//schema
const registrationSchema =new mongoose.Schema({
    name:String,
    email:String,
    password:String
});

//model
const Registration = mongoose.model("Registration",registrationSchema);
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/pages/index.html");
})

app.post("/register", async (req,res)=>{
    try{
        const {name,email,password}=req.body;
        const existinguser=await Registration.findOne({email:email});

        if(!existinguser){
        const regiData=new Registration ({
            name,
            email,
            password
        });
       await regiData.save();
       res.redirect("/success");
    }
    else{
        res.redirect("/error");
    }
    }
    catch(error){
        res.redirect("/error")
    }
})

app.get("/success",(req,res)=>{
    res.sendFile(__dirname+"/pages/success.html")
});

app.get("/error",(req,res)=>{
    res.sendFile(__dirname+"/pages/error.html")
});

app.listen(port,()=>{
    console.log(`server is running ${port}`)
});