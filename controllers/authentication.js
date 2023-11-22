export const checkIfAuthenticated =(req,res,next) =>{
    try{
        if(req.session.user.loggedIn === 1){
            
            return next();
        }   
    }catch(e){
        
    }

    res.redirect('/login')
}
