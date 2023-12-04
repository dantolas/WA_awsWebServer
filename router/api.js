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

    console.log("Api blogId query params:"+req.query.id);

    if(!req.query.id){
        return res.send("A valid id must be sent with this request. The id must be a positive integer.");
    }

    let id;
    try {
        id = parseInt(req.query.id);
    } catch (error) {
        return res.send("A valid id must be sent with this request. The id must be a positive integer.");
    }

    let rows;
    try {
    rows = await query('SELECT Post.title AS title, Post.content AS content, Post.date AS date, Login.username AS author'+
    ' FROM Post INNER JOIN Login'+
    ' ON Post.author = Login.id AND Post.id =?',[id]);
    } catch (error) {
        console.log(error);
        return res.send("Error during SQL query.");
    }

    if(!rows ||rows.length == 0){
        res.status(200);
        res.set('Content-Type', 'application/json');
        let data = {posts:[]};
        return res.send(JSON.stringify(data));
    }
     
    res.status(200);
    res.set('Content-Type', 'application/json');
    let data = {posts:[]}
    
    let author = rows[0].author;
    let title = rows[0].title;
    let content = rows[0].content;
    let date = rows[0].date;
    let post = {'author':author,'title':title,'content':content,'date':date}
    data.posts.push(post);

    
    return res.send(JSON.stringify(data));
})
 


router.get('/api/blogId/:id',async (req,res) =>{

    console.log("Api blogId url params:"+req.params);

    if(!req.params.id){
        return res.send("A valid id must be sent with this request. The id is a positive integer.");
    }
    let id;
    try {
        id = parseInt(req.query.id);
    } catch (error) {
        return res.send("A valid id must be sent with this request. The id must be a positive integer.");
    }


    let rows;
    try {
    rows = await query('SELECT Post.title AS title, Post.content AS content, Post.date AS date, Login.username AS author'+
    ' FROM Post INNER JOIN Login'+
    ' ON Post.author = Login.id AND Post.id =?',[id]);
    } catch (error) {

        console.log(error);
        return res.send("Error during SQL query.");
    }


    if(!rows ||rows.length == 0){
        res.status(200);
        res.set('Content-Type', 'application/json');
        let data = {posts:"No posts present in database"};
        return res.send(JSON.stringify(data));
    }

     
    res.status(200);
    res.set('Content-Type', 'application/json');
    let data = {posts:[]}
    
    let author = rows[0].author;
    let title = rows[0].title;
    let content = rows[0].content;
    let date = rows[0].date;
    let post = {'author':author,'title':title,'content':content,'date':date}
    data.posts.push(post);

    return res.send(JSON.stringify(data));
})

router.post('/api/blog',checkIfAuthenticated,async (req,res) =>{

    let body = req.body;
    console.log(req.session.user)

    try{
        body = JSON.parse(req.body);
    }catch(e){

    }

    console.log(body);
    
    
    if(!body || !body.title || !body.content){
        return res.send("You must send a JSON object as the body of your request. Use this format: {title:<text>,content:<text>}");
    }

    let rows;
    let userId = req.session.user["id"];
    console.log(userId);

    

    try{
       rows = await query('INSERT INTO Post(author,title,content,date) values (?,?,?,NOW());',[userId,body.title,body.content]);
    }catch(e){
        console.log(e);
        return res.send("Error in SQL query, either the author with this ID does not exist, or your title or content were too long.");   
    }

    try {
        rows = await query('SELECT MAX(id) as id from Post;');
    } catch (error) {
        console.log(error);
    }

    if(!rows){
        return res.send("No post id returned after insert.");
    }

    console.log(rows);

    let response = {Request:"Success", idOfPost:rows[0].id};
    return res.send(JSON.stringify(response));
})

router.delete('/api/blog/:id',checkIfAuthenticated,async (req,res)=>{

    if(!req.params.id){
        return res.send("A valid id must be sent with this request. The id must be a positive integer.");
    }

    let id;
    try {
        id = parseInt(req.params.id);
    } catch (error) {
        return res.send("A valid id must be sent with this request. The id must be a positive integer.");
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

router.delete('/api/blog',checkIfAuthenticated,async (req,res)=>{

    console.log("Api delete blog query params:"+req.query.id);

    if(!req.query.id){
        return res.send("A valid id must be sent with this request. The id must be a positive integer.");
    }

    let id;
    try {
        id = parseInt(req.query.id);
    } catch (error) {
        return res.send("A valid id must be sent with this request. The id must be a positive integer.");
    }

    try {
        query('DELETE FROM Post WHERE id = ?',[req.query.id]);
    } catch (error) {
        return res.send("Error during SQL query.");
    }
     
    res.status(200);
    return res.send("Sucesfully deleted.");
})





export default router;