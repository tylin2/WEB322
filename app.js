const express = require("express");  
const exphbs= require("express-handlebars");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const generalController =require("./controllers/general");
const productController=require("./controllers/product");
const userController=require("./controllers/user");

require('dotenv').config({path:"./config/keys.env"}); //load environment variable file

const app = express();

app.engine("handlebars",exphbs());
app.set("view engine", "handlebars");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
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