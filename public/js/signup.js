$("document").ready(function(){
  $('#form-sign-up').on('submit', function(e){
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
    });
  });

});
