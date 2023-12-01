import sessions from 'express-session';

export const checkIfAuthenticated =(req,res,next) =>{
    try{

        if(req.header("non-auth")){
            let user = {"username":rows[0].username, "loggedIn":1};
    
            req.session.user = JSON.stringify(user);
            return next();
        }

        if(!req.session.user){
            console.log("Auth fired:"+req.url);
            req.session.lastRequestedAuthUrl = req.url;
            return res.redirect('/login');
        }   
    }catch(e){
       console.log("Exception caught in checkIfAuthenticated");
       console.log(e); 
       return res.send("Check if authenticated exception.");
    }
    return next();
}
