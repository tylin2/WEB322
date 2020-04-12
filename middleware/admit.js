const isAdmin=(req,res,next)=>{
    if(req.session.userInfo.type=="Admin"){
        next();
    }else{
        res.redirect("/users/login");
    }    
}
module.exports = isAdmin;