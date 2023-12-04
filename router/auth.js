import {query} from '../functions/database.js'
import express from 'express'
import {validatePassword,hashPassword} from '../functions/passValidation.js'
import sessions from 'express-session';
import { generateSalt } from '../functions/saltGenerator.js';
import { fileURLToPath } from "url";


const router = express.Router();


router.post('/login', async (req, res) => {  


    let requestUsername = req.body.username;
    let requestPassword = req.body.password;

    let rows = null;
    let params = [requestUsername,requestUsername]
    try{
        rows = await query('SELECT passHash,id,salt FROM Login WHERE Login.username = ? OR Login.email = ?', params);
    }catch(Exception){

    res.status(401);
    return res.send("Error during SQL query. Please try again later.");

    }

    if(!rows || rows.length == 0){
    res.status(401);
        return res.send("Incorrect login attributes. I didn't quite get to making flash messages...") 
    }


    let reqPasswordHash = hashPassword((requestPassword+rows[0].salt))

    if(!validatePassword(reqPasswordHash,rows[0].passHash)){

        res.status(401);
        return res.send("Incorrect login password. I didn't quite get to making flash messages...") 

    }

    let user = {id:rows[0].id, loggedIn:1};

    req.session.user = user; 
    
    if(req.session.authUrl){
        return res.redirect(req.session.authUrl);
    }
    return res.redirect('/');

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
    res.redirect('views/login.html');
})  

router.delete('/logout',async (req,res)=>{

    req.session.destroy((err) => {
        if (err) {
            return res.status(400).send('Unable to log out')
        }
    });

    return res.redirect('/login');

})

export default router
