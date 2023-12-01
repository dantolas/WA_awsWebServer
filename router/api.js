import {query} from '../functions/database.js'
import express from 'express'
import {checkIfAuthenticated} from '../functions/authentication.js'
import sessions from 'express-session';


const router = express.Router();


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

    console.log(rows)
 
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
    if(!req.body){
        return res.send("You have sent a request without a body")
    }
    let body = null;

    try{
        body = JSON.parse(req.body);
    }catch(e){

    }
    
    if(!body){
        res.send("You must send a JSON object as the body of your request. Use this format: {author:<id>,title:<text>,content:<text>}");
    }
    let title = null;
    let content = null;
    let author = null;

    try{
        title = body.title;
        content = body.content;
        author = body.author;
        if(typeof author != 'number'){
            throw "Err";
        }
    }catch{
        res.send("You've sent JSON in the wrong format. Use this format: {author:<id>,title:<text>,content:<text>}");

    }

    let rows;
    try{
       let rows = await query('INSERT INTO Post(author,title,content,date) values (?,?,?,NOW());SELECT LAST_INSERT_ID() as id;',[author,title,content]);
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


export default router;