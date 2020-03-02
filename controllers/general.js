const express = require('express')
const router = express.Router();

router.get("/",(req,res)=>{
   
    res.render("general/app",{ //add general
        title:"Home",
        headingInfo: "Home Page"
    });

});

router.get("/registration",(req,res)=>{

    res.render("general/registration",{ //add customers
        title:"registration",
        headingInfo: "Registration"       
    });

});

//add new app.post
router.post("/registration",(req,res)=>{
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
            res.render("general/registration",{ //add customers
                title : "registration",
                headingInfo: "Registration",                        
                errors : errorMessages
               
        });

        }else{
            res.render("general/registration",{ //add customers
                title:"registration",
                headingInfo: "Registration"       
            });
        }

   

});

router.get("/login",(req,res)=>{
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
                res.render("general/login",{ //add customers
                        title : "login",
                        headingInfo: "Login",                        
                        successMessage : ``
                       
                });
        }
        else
        {
                
                res.render("general/login",{ //add customers
                        title : "login",
                        headingInfo: "Login",                        
                        successMessage : ``
                       
                });
        }
});

module.exports=router;