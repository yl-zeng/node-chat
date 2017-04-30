$("document").ready(function(){

  var params = jQuery.deparam(window.location.search);
  var token = params.token;
  var name = params.name;

  $('#curr-user').text(name);

  $('#button-enter').on('click', function(e){
    e.preventDefault();
    var formData = $("#form-dashboard").serializeArray();
    var room = formData[0].value;

    window.location.href=`/chat.html?name=${name}&room=${room}&token=${token}`;

  });

});
