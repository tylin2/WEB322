const express = require('express')
const router = express.Router();

router.get("/",(req,res)=>{
   
    res.render("general/app",{ //add general
        title:"Home",
        headingInfo: "Nin10do"
    });

});

module.exports=router;