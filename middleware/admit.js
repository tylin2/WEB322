const isAdmin=(req,res,next)=>{    
    if(req.session.userInfo){
        if(req.session.userInfo.type=="Admin"){
            next();
        }else{
            req.session.destroy();
            res.redirect("/users/login");
        } 
    }    
    else{        
        res.redirect("/users/login");
    }    
}
module.exports = isAdmin;