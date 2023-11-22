export const rootIndexResponse = async (req,res) =>{
    res.status(200);
    res.set('Content-Type','text/html');
    res.redirect('views/');
}