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
         alert("successfully sign up");
         window.location.href="/index.html";
       }
    });
  });

});
