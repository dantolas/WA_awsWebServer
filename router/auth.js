import {query} from '../functions/database.js'
import express from 'express'
import {validatePassword,hashPassword} from '../functions/passValidation.js'
import sessions from 'express-session';
import { generateSalt } from '../functions/saltGenerator.js';


const router = express.Router();


router.post('/login', (req, res) => {  

   console.log("Login attempt");

   let requestUsername = req.body.username;
   let requestPassword = req.body.password;

   console.log(requestUsername+" "+requestPassword)

   let rows = null;
   try{

       let rows = query('SELECT `passHash`,`username` FROM Login WHERE `Login.username` = ? OR `Login.email` = ?', requestUsername)
   }catch(Exception){

    //TODO: Remove after testing for safety
    let data = {"exception":exception, "TODO":"Remove after testing for safety"}
    res.status(401);
    res.set('Content-Type', 'application/json');
    return res.send(JSON.stringify(data));

   }


    if(!rows || !validatePassword(requestPassword,rows[0].passHash)){

        res.status(401);
        res.set('Content-Type', 'application/json');
        let data = {login:'false', error:'incorrect login attributes',explanation:'I was working on AJAX with jquery, that\'s the reason for this JSON response, however I couldn\'t get it to work in time so just accept this as a failed login attempt'};
        connection.end();
        return res.send(JSON.stringify(data)); 

    }

    let user = {"username":rows[0].username, "loggedIn":1};

    req.session.user = JSON.stringify(user);
    return res.redirect('/views/');

    

});  



router.post('/signup', (req, res) => {

    console.log('Signup atempt');
    
    let requestUsername = req.body.username;
    let requestPassword = req.body.password;
    let requestEmail = req.body.email;
    
    let salt = generateSalt(requestUsername,requestPassword);
    let passHash = hashPassword(passHash);

    console.log(requestUsername+" "+requestPassword+ " "+requestEmail);

    try{

        query('INSERT INTO Login(`username`,`email`,`passHash`) values (?,?,?)', requestUsername, requestEmail, passHash);

        console.log('Executed query');
        res.status(200);
        res.set('Content-Type','text/html');
        return res.send('Succesfully Signed-up. <a href=\'/web/\'>Back to Login.</a>');

    }catch(Exception){
        console.log('Error thrown during sql query');
        res.status(200);
        res.set('Content-Type', 'application/json');
        let data = {signup:'false', error:'Account already registered.'};
        return res.send(JSON.stringify(data));


    };

});


router.get('/login',(req,res)=>{
    res.redirect('views/login.html')
})  

router.delete('/logout',(req,res)=>{

    if(!req.session.user){
        throw Exception("User not defined")
    }

    req.session.user.username = ''
    req.session.user.loggedIn = 0

    res.redirect('/login');

})

export default router
