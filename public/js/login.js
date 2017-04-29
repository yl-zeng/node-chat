$("document").ready(function(){
  $('#form-log-in').on('submit', function(e){
    e.preventDefault();
    var formData = $("#form-log-in").serializeArray();
    var data = {
      "name": formData[0].value,
      "password": formData[1].value
    };
    console.log(data);
    $.ajax("/login",{
       type: "POST",
       contentType : 'application/json',
       data: JSON.stringify(data),
       success: function(result){
         window.location.href=`/chat.html?name=${result.name}&room=A`;
       }
    });
  });

});
