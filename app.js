const express = require("express");  
const exphbs= require("express-handlebars");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

require('dotenv').config({path:"./config/keys.env"}); //load environment variable file

const generalController =require("./controllers/general");
const productController=require("./controllers/product");
const userController=require("./controllers/user");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

app.engine("handlebars",exphbs(
    /*{
        helpers:{
            if_eq:function(){

            }
        }
    }*/
));
app.set("view engine", "handlebars");

app.use((req,res,next)=>{
    if(req.query.method=="PUT"){
        req.method="PUT"
    }
    else if(req.query.method=="DELETE"){
        req.method="DELETE"
    }
    next();
})

app.use("/",generalController);
app.use("/products",productController);
app.use("/users",userController);

mongoose.connect(process.env.MONGO_DB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log(`Connected to MONGODB~`);
})
.catch(err=>console.log(`Error occured : ${err}`));


const PORT=process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Web Server Started`);
});