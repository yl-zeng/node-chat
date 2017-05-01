$("document").ready(function(){

  var params = jQuery.deparam(window.location.search);
  var token = params.token;
  var name = params.name;

  $('#curr-user').text(name);

  $('#button-enter').on('click', function(e){
    e.preventDefault();
    var formData = $("#form-dashboard").serializeArray();
    var room = formData[0].value;
    if(room.trim().length>0){
      window.location.href=`/chat.html?name=${name}&room=${room}&token=${token}`;
    }else {
      swal({
        type:"error",
        title:"Enter something"
      }).then(function (){
        $("[name='room']").val("");
      });
    }
  });

  $('#button-signout').on('click',function(e){
    var data = {
      "token":token
    };

    $.ajax("/signout",{
      type:"DELETE",
      contentType : 'application/json',
      data: JSON.stringify(data),
      success: function(result,textStatus,request){
        swal({
          type:"success",
          title:`${result.name} successfully log out`,
          allowOutsideClick:true
        }).then(function(){
          window.location.href="/";
        });
      }
    });
  });

// var inFormOrLink;
// $('a').on('click', function() { inFormOrLink = true; });
// $('form').on('submit', function() { inFormOrLink = true; });
//
// $(window).on("beforeunload", function() {
//     return inFormOrLink ? "Do you really want to close?" : null;
// })


});
