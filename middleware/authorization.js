const AccountLoader=(req,res)=>{
    if(req.session.userInfo.type=="Admin"){
        res.render("users/AdminAccount",{ 
            title:"AdminAccount",
            headingInfo: "AdminAccount"     
        });          
    }
    else{
        res.render("users/userAccount",{ 
            title:"myAccount",
            headingInfo: "myAccount"     
        });        
    }
}
module.exports = AccountLoader;