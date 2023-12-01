export const checkIfAuthenticated =(req,res,next) =>{
    try{
        if(!req.session.user){
            console.log("User not defined");
            return res.redirect('/login');
        }   
    }catch(e){
       console.log("Exception caught in checkIfAuthenticated");
       console.log(e); 
       return res.send("Check if authenticated exception.");
    }
    return next();
}
