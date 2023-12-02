import {query} from '../functions/database.js'
import express from 'express'
import {checkIfAuthenticated} from '../functions/authentication.js'
import sessions from 'express-session';


const router = express.Router();


router.get('/api',checkIfAuthenticated,async(req,res)=>{
    res.status(200);
    res.sendFile('/api/api.html',{root:'views'});
})

router.get('/api/blog',async (req,res)=>{

    let rows = await query('SELECT Post.title AS title, Post.content AS content, Post.date AS date, Login.username AS author'+
    ' FROM Post INNER JOIN Login'+
    ' ON Post.author = Login.id;');

    if(!rows || rows.length <= 0){
        res.status(200);
        res.set('Content-Type', 'application/json');
        let data = {posts:"No posts present in database"};
        return res.send(JSON.stringify(data));
    }

 
    res.status(200);
    res.set('Content-Type', 'application/json');
    let data = {"posts":[]}
    for(let i = 0; i < rows.length; i++){
        let author = rows[i].author;
        let title = rows[i].title;
        let content = rows[i].content;
        let date = rows[i].date;
        let post = {'author':author,'title':title,'content':content,'date':date}
        data.posts.push(post);
    }
    
    return res.send(JSON.stringify(data));
 
})
 


router.get('/api/blogId/:id',async (req,res) =>{

    if(!req.params.id || typeof req.params.id != 'number'){
        return res.send("A valid id must be sent with this request. The id is a positive integer.");
    }
    let rows;
    try {
    rows = await query('SELECT Post.title AS title, Post.content AS content, Post.date AS date, Login.username AS author'+
    ' FROM Post INNER JOIN Login'+
    ' ON Post.author = Login.id; AND Post.id =?',[req.params.id]);
    } catch (error) {
        return res.send("Error during SQL query.");
    }
     
    res.status(200);
    res.set('Content-Type', 'application/json');
    let data = {"posts":[]}
    for(let i = 0; i < rows.length; i++){
        let author = rows[i].author;
        let title = rows[i].title;
        let content = rows[i].content;
        let date = rows[i].date;
        let post = {'author':author,'title':title,'content':content,'date':date}
        data.posts.push(post);
    }
    
    return res.send(JSON.stringify(data));
})

router.post('/api/blog',checkIfAuthenticated,async (req,res) =>{

    console.log('POST API REACHED');
    
    let body = null;

    try{
        body = JSON.parse(req.body);
    }catch(e){

    }
    
    if(!body || !body.title || !body.content || body.username){
        return res.send("You must send a JSON object as the body of your request. Use this format: {title:<text>,content:<text>,username:<yourUsername>}");
    }

    if(req.username != req.session.user.username){
        return res.send("Your username does not match the username sent. Please login as the user you want to post as.");
    }

    

    let rows;


    try {
        rows = await query('SELECT id FROM Login WHERE Login.username = ? OR Login.email = ?;'[body.username,body.username]);
    } catch (error) {
        return res.send("Couldn't extract userId from username.");
    }

    if(!rows){
        return res.send("No user id returned for this username.");
    }

    let userId = rows[0].id;

    try{
       rows = await query('INSERT INTO Post(author,title,content,date) values (?,?,?,NOW());SELECT LAST_INSERT_ID() as id;',[userId,title,content]);
    }catch(e){
        console.log(e);
        return res.send("Error in SQL query, either the author with this ID does not exist, or your title or content were too long.");   
    }

    if(!rows){
        return res.send("No post id returned after insert.");
    }

    let response = {Request:"Success", idOfPost:rows[0].id};
    return res.send(JSON.stringify(response));
})

router.delete('/api/blog/:id',checkIfAuthenticated,async (req,res)=>{

    if(!req.params.id || typeof req.params.id != 'number'){
        res.send("A valid id must be sent with this request. The id is a positive integer.");
    }
    try {
        query('DELETE FROM Post WHERE id = ?',[req.params.id]);
    } catch (error) {
        res.send("Error during SQL query.");
    }
     
    res.status(200);
    res.set('Content-Type', 'application/json');
    let data = {query:"Sucess-post was deleted."}
    
    return res.send(JSON.stringify(data));
})





export default router;