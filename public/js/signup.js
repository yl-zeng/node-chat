$("document").ready(function(){
  $('#button-sign-up').on('click', function(e){
    e.preventDefault();
    var formData = $("#form-sign-up").serializeArray();
    var data = {
      "name": formData[0].value,
      "password": formData[1].value
    };
    console.log(data);
    $.ajax("/signup",{
       type: "POST",
       contentType : 'application/json',
       data: JSON.stringify(data),
       success:function(){
         swal({
           title:"",
           type:"success",
           text:"successfully sign up",
           allowOutsideClick:true
         }).then(function(){
           window.location.href="/";
         });
       },
       error:function(){
         swal({
           type:"error",
           title:"sign up failed",
           allowOutsideClick:true
         }).then(function(){
           window.location.href="/signup.html";
         });
       }
    });
  });

});
