console.log("login script fired");
usernameInput = $("#username");
passwordInput = $("#password");

let formData = {
                    username: usernameInput.value,
                    password: passwordInput.value
               }

$('#loginButton').click(function (event) {
   console.log('click');
   event.stopPropagation();
   $.ajax({
       type:"POST",
       url:"/validateLogin",
       data: formData,

       success: function(data, textStatus, jqXHR)
       {
           console.log(textStatus);
           console.log(data);
       },
       error: function (jqXHR, textStatus, errorThrown)
       {
           console.log(textStatus);
           console.log(errorThrown);
       }

   })

});

