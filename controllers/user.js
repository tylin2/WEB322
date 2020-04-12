const express = require('express')
const router = express.Router();
const userModel = require("../model/users");
const isLoggedIn = require("../middleware/auth");
const AccountLoader = require("../middleware/authorization");
const isAdmin = require("../middleware/admit");
const moment=require('moment');
const bcrypt = require("bcryptjs");

router.get("/registration",(req,res)=>{

    res.render("users/registration",{ //add customers
        title:"registration",
        headingInfo: "Registration"       
    });

});

//add new app.post
router.post("/registration",(req,res)=>{
        
    const errorMessages = [];    
        
        if(req.body.fullName=="")  {                            
                errorMessages.push("! Enter Your Name");
        }

        if(req.body.email=="")  {                
                errorMessages.push("! Enter Your email");
        } else {
                userModel.findOne({email:req.body.email})
                .then((user)=>{                       
                        if(user==null||user=='undefined'){
                                
                        }else{
                                                         
                        }                                                                                                       
                })                 
                .catch(err=>console.log(`Error happened when adding for the database: ${err}`));   
                                  
        }

        if(req.body.password=="")   {
                errorMessages.push("! Enter Your password");
        }
        const reg = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,.\/]).{6,12}$/;                    
        if (!reg.test(req.body.password)) {
                errorMessages.push("! Password must consist of 6-12 letters, numbers, and special symbols");
        }

        if(req.body.password!=req.body.password2)  {
                errorMessages.push("! Passwords are not match");
        }        
       
        if(errorMessages.length > 0 )  {                
            res.render("users/registration",{ 
                title : "registration",
                headingInfo: "Registration",                        
                errors : errorMessages,
                fullName:req.body.fullName,
                email:req.body.email,
                password:req.body.password,
                password2:req.body.password2               
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
                
                const newUser = {
                        fullName:req.body.fullName,
                        email:req.body.email,
                        password:req.body.password
                }

                const user = new userModel(newUser);
                user.save()                
                .then(()=>{
                        res.redirect("/users/myAccount");          
                })           
                .catch(err=>console.log(`Error happened when inserting in the database: ${err}`));                
        }

   

});

router.get("/login",(req,res)=>{
       
        res.render("users/login",{ 
                title:"login",
                headingInfo: "Login"       
        });
            
});

router.post("/login",(req,res)=>{
    userModel.findOne({email:req.body.email})
    .then(user=>{
            const errors=[];
            if(user==null)  {
                    errors.push("Sorry!! Your email or password is incorrect")
                    res.render("users/login",{ 
                        title:"login",
                        headingInfo: "Login",
                        errors       
                        });
            } 
            else {
                bcrypt.compare(req.body.password, user.password)
                .then(isMatched=>{
                        if(isMatched){
                                req.session.userInfo=user;
                                res.redirect("/users/myAccount");                                
                        }
                        else {
                                errors.push("Sorry!! Your email or password is incorrect")
                                res.render("users/login",{ 
                                    title:"login",
                                    headingInfo: "Login",
                                    errors       
                                    });
                        }
                })
                .catch(err=>console.log(`Error: ${err}`));   
            }
    })
    .catch(err=>console.log(`Error: ${err}`));
});

router.get("/myAccount",isLoggedIn,AccountLoader);

router.get("/logout",(req,res)=>{
       req.session.destroy();
        res.redirect("/users/login");            
});

router.get("/AdminList",isAdmin,(req,res)=>{
       userModel.find()
        .then((Users)=>{            
            const filterUsers=Users.map(User=>{
                var date=moment(User.dateCreate).format("YYYY-MM-DD");
                return{                        
                    id:User._id,
                    fullName:User.fullName,
                    email:User.email,
                    type:User.type,
                    dateCreate:date                                   
                }
            });
            res.render("users/userList",{ 
                title:"AdminAccount",
                headingInfo: "UsersList",
                data:filterUsers                   
            })
        })
        .catch(err=>console.log(`Error happened when pulling from the database: ${err}`));    
    })

module.exports=router;