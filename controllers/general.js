const express = require('express')
const router = express.Router();

router.get("/",(req,res)=>{
   
    res.render("general/app",{ //add general
        title:"Home",
        headingInfo: "Nintenda"
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
        
        if(req.body.fullName=="")
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

        if(req.body.password!=req.body.password2)
        {
                errorMessages.push("! Passwords are not match");
        }

        if(errorMessages.length > 0 )
        {
            res.render("general/registration",{ 
                title : "registration",
                headingInfo: "Registration",                        
                errors : errorMessages               
                });

        }else{
                const {fullName, email}=req.body;
                const sgMail = require('@sendgrid/mail');
                sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
                const welcome = {
                  to: `${email}`,
                  from: `s88432000@gmail.com`,
                  subject: `Welcome! Confirm Your Email`,
                  html: 
                  `Thanks for signing up! ${fullName} <br> 
                   Your username is ${email}.<br>
                  `,
                };
                sgMail.send(welcome)
                .then(()=>{
                        res.redirect("/");
                })
                .catch(err=>{
                        console.log(`Error ${err}`)
                })
                
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