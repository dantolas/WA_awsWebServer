export const checkIfAuthenticated =(req,res,next) =>{
    console.log("checkIfAuthenticated fired")
    try{
        if(req.session.user.loggedIn){
            
            return next();
        }   
    }catch(e){
       console.log("Exception caught in checkIfAuthenticated")
       console.log(e) 
       return res.send("ERORRITO ERRORITO BABy")
    }

    res.redirect('/login')
}
