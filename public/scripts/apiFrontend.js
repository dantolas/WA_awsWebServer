const apiForm = document.querySelector("#apiForm");

    
function updateFormMethod(element){
    apiForm.setAttribute("method",element.value);
}

document.querySelector("#getBlog").addEventListener('click',()=>{

    apiForm.replaceChildren();
    
    const sendButton = document.createElement("input");
    sendButton.type = "submit";
    sendButton.innerHTML = "Send GET request";
    sendButton.value = "GET";
    sendButton.className = "sendButton";

    apiForm.appendChild(sendButton);
    apiForm.action = "api/blog";
    updateFormMethod(sendButton);

})

document.querySelector("#getBlogId").addEventListener('click',()=>{
    apiForm.replaceChildren();

    const inputID = document.createElement("input");
    inputID.type = "number";
    inputID.required = true;
    inputID.className="numberInput";
    inputID.name = 'id';

    const sendButton = document.createElement("input");
    sendButton.type = "submit";
    sendButton.value = "GET";
    sendButton.className = "sendButton";

    apiForm.appendChild(inputID);
    apiForm.appendChild(sendButton);
    updateFormMethod(sendButton);
    apiForm.action = "/api/blogId"

})

document.querySelector("#deleteBlog").addEventListener('click',()=>{
    apiForm.replaceChildren();
    
    let string = "curl -X DELETE 16.170.146.152/api/blog?id=<ID>	-H \"Accept: application/json\"";

    const sendButton = document.createElement("textarea");
    
    sendButton.innerHTML = "Must be sent manually. Try "+string;
    sendButton.className = "textInputArea";
    sendButton.rows = 5;
    sendButton.cols = 60;
    
    
    apiForm.appendChild(sendButton);

})

document.querySelector("#postBlog").addEventListener('click',()=>{
    apiForm.replaceChildren();


    const title = document.createElement("input");
    title.type = "text";
    title.placeholder = "Title goes here";
    title.name = "title";
    title.required = true;
    title.className = "textInput";

    const content = document.createElement("textarea");
    content.rows = 5;
    content.cols = 60;
    content.placeholder = "Content goes here";
    content.name = "content";
    content.required = true;
    content.className = "textInputArea";

    const sendButton = document.createElement("input");
    sendButton.type = "submit";
    sendButton.innerHTML = "Send POST request";
    sendButton.value = "POST";
    sendButton.className = "sendButton";

    apiForm.appendChild(title);
    apiForm.appendChild(content);
    apiForm.appendChild(sendButton);
    updateFormMethod(sendButton);
    apiForm.action = '/api/blog';

})