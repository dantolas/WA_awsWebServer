export const checkIfAuthenticated =(req,res,next) =>{
    try{
        if(req.session.user.loggedIn === 1){
            
            return next();
        }   
    }catch(e){
       console.log("Exception caught in checkIfAuthenticated")
       console.log(e) 
       return res.send("ERORRITO ERRORITO BABy")
    }

    res.redirect('/login')
}
