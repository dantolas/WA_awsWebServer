import {query} from '../functions/database.js'
import express from 'express'
import {checkIfAuthenticated} from '../functions/authentication.js'
import sessions from 'express-session';


const router = express.Router();


router.get('/api/blog',async (req,res)=>{

    let rows = query('SELECT Post.title AS title, Post.content AS content, Post.date AS date, Login.username AS author'+
    ' FROM Post INNER JOIN Login'+
    ' ON Post.author = Login.id;');

    if(!rows){
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
 

router.post('/api/blog',checkIfAuthenticated,(req,res) =>{

    console.log('POST API REACHED');
    let rows;
    try{
        rows = query('INSERT INTO Post(author,title,content,date) values (?,?,?,NOW());')
    }catch(e){
        console.log(e);
        return res.send("Error occured,sorry bruv");
        
    }

    let response = {Request:"Success"}
    return res.send(JSON.stringify(response));
})


export default router;