import {query} from '../functions/database.js'
import express from 'express'
import {validatePassword,hashPassword} from '../functions/passValidation.js'
import sessions from 'express-session';
import { generateSalt } from '../functions/saltGenerator.js';


const router = express.Router();


router.post('/login', async (req, res) => {  


   let requestUsername = req.body.username;
   let requestPassword = req.body.password;

   console.log("request params: "+requestPassword, requestUsername)


   let rows = null;
   let params = [requestUsername,requestUsername]
   try{
        rows = await query('SELECT passHash,username,salt FROM Login WHERE Login.username = ? OR Login.email = ?', params);
        console.log(rows);
   }catch(Exception){

    //TODO: Remove after testing for safety
    let data = {"exception":exception, "TODO":"Remove after testing for safety"}
    res.status(401);
    res.set('Content-Type', 'application/json');
    return res.send(JSON.stringify(data));

   }

   if(!rows){
    res.status(401);
        res.set('Content-Type', 'application/json');
        let data = {login:'false', error:'incorrect login attributes, rows empty',};
        return res.send(JSON.stringify(data)); 
   }

   console.log("passHash:"+rows[0].passHash + " password:"+requestPassword+" compareHash:" + hashPassword(requestPassword+rows[0].salt))

    let reqPasswordHash = hashPassword((requestPassword+rows[0].salt))

    console.log(validatePassword(reqPasswordHash,rows[0].passHash))

    if(!validatePassword(reqPasswordHash,rows[0].passHash)){

        res.status(401);
        res.set('Content-Type', 'application/json');
        let data = {login:'false', error:'incorrect login password',};
        return res.send(JSON.stringify(data)); 

    }

    let user = {"username":rows[0].username, "loggedIn":1};

    req.session.user = JSON.stringify(user);
    return res.redirect('/views/');

    

});  



router.post('/signup', async (req, res) => {

    
    let requestUsername = req.body.username;
    let requestPassword = req.body.password;
    let requestEmail = req.body.email;
    
    let salt = generateSalt(requestUsername,requestEmail);
    let passHash = hashPassword((requestPassword+salt));


    try{

        await query('INSERT INTO Login(username,email,passHash,salt) values (?,?,?,?)', [requestUsername,requestEmail,passHash,salt]);

        console.log('Executed query');
        res.status(200);
        res.set('Content-Type','text/html');
        return res.send('Succesfully Signed-up. <a href=\'/\'>Back to Login.</a>');

    }catch(Exception){
        console.log('Error thrown during sql query');
        res.status(200);
        res.set('Content-Type', 'application/json');
        let data = {signup:'false', error:'Account already registered.'};
        return res.send(JSON.stringify(data));


    };

});


router.get('/login',async (req,res)=>{
    res.redirect('views/login.html')
})  

router.delete('/logout',async (req,res)=>{

    if(!req.session.user){
        throw Exception("User not defined")
    }

    req.session.destroy((err) => {
        if (err) {
            return res.status(400).send('Unable to log out')
        }
    });

    return res.redirect('/login');

})

export default router
