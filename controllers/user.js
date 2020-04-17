const express = require('express')
const router = express.Router();
const userModel = require("../model/users");
const productModel = require("../model/products");
const cartModel = require("../model/cart");
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
                
                        userModel.findOne({email:req.body.email})
                        .then((user)=>{
                                const errors=[];                       
                                if(user==null||user=='undefined'){
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
                                }else{
                                        errors.push("! Email is existing")
                                        res.render("users/registration",{ 
                                                title : "registration",
                                                headingInfo: "Registration",                        
                                                errors : errors,
                                                fullName:req.body.fullName,
                                                email:req.body.email,
                                                password:req.body.password,
                                                password2:req.body.password2               
                                        });                               
                                }                                                                                                       
                        })                 
                        .catch(err=>console.log(`Error happened when adding for the database: ${err}`));                
                               
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
                        email:req.body.email,
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
                                    email:req.body.email,
                                    errors       
                                });
                        }
                })
                .catch(err=>console.log(`Error: ${err}`));   
            }
    })
    .catch(err=>console.log(`Error: ${err}`));
});

router.get("/forgotPassword",(req,res)=>{
       
        res.render("users/forgot",{ 
                title:"forgotPassword",
                headingInfo: "Enter your email"       
        });            
});

router.post("/forgotPassword",(req,res)=>{
        const errorMessages = [];       
       
        if(req.body.email=="")  {                
                errorMessages.push("! Enter Your email");
        }
        if(errorMessages.length > 0 )  {                
                res.render("users/forgot",{ 
                    title:"forgotPassword",
                    headingInfo: "Enter your email",                        
                    errors : errorMessages,                    
                    email:req.body.email                                 
                });
    
        }else{
                userModel.findOne({email:req.body.email})
                .then(user=>{
                        const errors=[];
                        if(user==null)  {
                                errors.push("Sorry!! Your email is incorrect")
                                res.render("users/forgot",{ 
                                        title:"forgotPassword",
                                        headingInfo: "Enter your email",
                                        email:req.body.email,                        
                                        errors                                                                       
                                });
                        } 
                else {
                        const {_id,fullName,email}=user;
                        const passwordMail = require('@sendgrid/mail');
                        passwordMail.setApiKey(process.env.SEND_GRID_API_KEY);
                        const password = {
                            to: `${email}`,
                            from: `s88432000@gmail.com`,
                            subject: `Reset Password`,
                            html: 
                            `A password reset event has been triggered.  <br>
                            If you do not reset your password within two hours, you will need to submit a new request.<br>
                            To complete the password reset process, visit the following link:<br>
                            <br>
                            https://web322tylin2.herokuapp.com/users/edit/${_id}
                            <br> 
                            <br>
                            UserName: ${fullName}<br>
                            UserEmail: ${email}                                        
                            `,
                        };
                        passwordMail.send(password)
                        .then(()=>{  
                                const errors=[];
                                errors.push("Please check your email")          
                                res.render("users/forgot",{ 
                                        title:"forgotPassword",
                                        headingInfo: "Enter your email",
                                        email:req.body.email,                        
                                        errors                                                                       
                                });                            
                        })
                        .catch(err=>{
                            console.log(`Error in forgoting Password:  ${err}`)
                        })   
                }
        })
        .catch(err=>console.log(`Error: ${err}`));    

        }                      
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

router.delete("/delete/:email",isAdmin,(req,res)=>{
        productModel.deleteMany({createBy:req.params.email})
        .then(()=>{
                cartModel.deleteMany({createBy:req.params.email})
                .then(()=>{
                        userModel.deleteOne({email:req.params.email})
                        .then(()=>{
                                 res.redirect("/users/AdminList");
                        })
                        .catch(err=>console.log(`Error happened when deleting user from the database :${err}`));
                })
                .catch(err=>console.log(`Error happened when deleting data from the database in cart with user :${err}`));
                
        })
        .catch(err=>console.log(`Error happened when deleting data from the database with user :${err}`));
})

router.get("/edit/:id",(req,res)=>{    
        userModel.findById(req.params.id)
        .then((user)=>{        
            const {_id}=user;            
            res.render("users/editPassword",{
                title:"Reset Password",
                headingInfo: "Reset Password",
                _id            
            })
        })
        .catch(err=>console.log(`Error happened when editing for the database: ${err}`));
        
})

router.put("/edit/:id",(req,res)=>{
        const errorMessages = [];    
        if(req.body.password=="")   {
                errorMessages.push("! Enter Your password");
        }

        if(req.body.password2=="")   {
                errorMessages.push("! Enter Your password again");
        }

        const reg = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,.\/]).{6,12}$/;                    
        if (!reg.test(req.body.password)) {
                errorMessages.push("! Password must consist of 6-12 letters, numbers, and special symbols");
        }

        if(req.body.password!=req.body.password2)  {
                errorMessages.push("! Passwords are not match");
        }        
       
        if(errorMessages.length > 0 )  { 
                res.render("users/editPassword",{
                        title:"Reset Password",
                        headingInfo: "Reset Password",
                        errors : errorMessages,
                        password:req.body.password,
                        password2:req.body.password2
                                    
                })         
        }else{
                const user={
                        password:req.body.password
                }
                    userModel.updateOne({_id:req.params.id},user)
                    .then(()=>{
                        res.redirect("/users/login");                      
                    })
                    .catch(err=>console.log(`Error happened when updating for the database in cart: ${err}`));                 
        }
        
})

module.exports=router;