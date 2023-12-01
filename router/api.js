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
 


router.get('/api/blogId',async (req,res) =>{

    if(!req.id || typeof req.id != 'number'){
        return res.send("A valid id must be sent with this request. The id is a positive integer.");
    }
    let rows;
    try {
    rows = await query('SELECT Post.title AS title, Post.content AS content, Post.date AS date, Login.username AS author'+
    ' FROM Post INNER JOIN Login'+
    ' ON Post.author = Login.id; AND Post.id =?',[req.id]);
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

router.post('/api/blog',async (req,res) =>{

    console.log('POST API REACHED');
    if(!req.body){
        return res.send("You have sent a request without a body")
    }
    let body = null;

    try{
        body = JSON.parse(req.body);
    }catch(e){

    }
    
    if(!body){
        res.send("You must send a JSON object as the body of your request. Use this format: {title:<text>,content:<text>}");
    }

    let title = body.title;
    let content = body.author;
    if(!title || !content){
        res.send("You've sent JSON in the wrong format. Use this format: {author:<id>,title:<text>,content:<text>}");

    }
    

    let rows;
    try{
       let rows = await query('INSERT INTO Post(author,title,content,date) values (?,?,?,NOW());SELECT LAST_INSERT_ID() as id;',[req.session.user.username,title,content]);
    }catch(e){
        console.log(e);
        return res.send("Error in SQL query, either the author with this ID does not exist, or your title or content were too long.");   
    }

    if(!rows){
        return res.send("Error no post id returned.");
    }

    let response = {Request:"Success", idOfPost:rows[0].id};
    return res.send(JSON.stringify(response));
})

router.delete('/api/blog',checkIfAuthenticated,async (req,res)=>{

    if(!req.id || typeof req.id != 'number'){
        res.send("A valid id must be sent with this request. The id is a positive integer.");
    }
    try {
        query('DELETE FROM Post WHERE id = ?',[req.id]);
    } catch (error) {
        res.send("Error during SQL query.");
    }
     
    res.status(200);
    res.set('Content-Type', 'application/json');
    let data = {query:"Sucess-post was deleted."}
    
    return res.send(JSON.stringify(data));
})





export default router;