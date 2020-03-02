const express = require("express");  
const exphbs= require("express-handlebars");
const bodyParser = require('body-parser');
const productModel = require("./model/product");

const app = express();

app.engine("handlebars",exphbs());
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("public"));


app.get("/",(req,res)=>{
   
    res.render("general/app",{ //add general
        title:"Home",
        headingInfo: "Home Page"
    });

});

app.get("/products",(req,res)=>{

    res.render("products/products",{ //add products
        title:"Products",
        headingInfo: "Products",
        products :productModel.getAllProducts()
    });

});

app.get("/registration",(req,res)=>{

    res.render("customers/registration",{ //add customers
        title:"registration",
        headingInfo: "Registration"       
    });

});

//add new app.post
app.post("/registration",(req,res)=>{
    const errorMessages = [];
        
        if(req.body.Name=="")
        {
                errorMessages.push("! Enter Your Name");
        }

        if(req.body.email=="")
        {
                errorMessages.push("! Enter Your email");
        }

        if(req.body.password=="")
        {
                errorMessages.push("! Enter Your password");
        }

        if(errorMessages.length > 0 )
        {
            res.render("customers/registration",{ //add customers
                title : "registration",
                headingInfo: "Registration",                        
                errors : errorMessages
               
        });

        }else{
            res.render("customers/registration",{ //add customers
                title:"registration",
                headingInfo: "Registration"       
            });
        }

   

});

app.get("/login",(req,res)=>{
    const errorMessages = [];
        
        if(req.body.email=="")
        {
                errorMessages.push("Invaild email");
        }

        if(req.body.password=="")
        {
                errorMessages.push("Incorrect password");
        }

        if(errorMessages.length >0 )
        {
                res.render("customers/login",{ //add customers
                        title : "login",
                        headingInfo: "Login",                        
                        successMessage : ``
                       
                });
        }
        else
        {
                
                res.render("customers/login",{ //add customers
                        title : "login",
                        headingInfo: "Login",                        
                        successMessage : ``
                       
                });
        }
});


const PORT=process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`Web Server Started`);
});