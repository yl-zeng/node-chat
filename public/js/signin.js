$("document").ready(function(){

  $('#button-sign-in').on('click', function(e){
    e.preventDefault();
    var formData = $("#form-sign-in").serializeArray();
    var data = {
      "name": formData[0].value,
      "password": formData[1].value
    };
    console.log(data);

    $.ajax("/signin",{
       type: "POST",
       contentType : 'application/json',
       data: JSON.stringify(data),
       success: function(result,textStatus,request){
         var name = result.name;
         var token = request.getResponseHeader("token");
         console.log(token);
         console.log(name);
         window.location.href=`/dashboard.html?name=${name}&token=${token}`;
       },
       error: function(request,textStatus,err){
         swal({
           title:"sign in failed",
           type:"error",
           allowOutsideClick:true
         }).then(function(){
           $("[name='password']").val("");
         });
       }
    });

  });

});
