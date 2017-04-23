
$("document").ready(function (){
  var socket = io();

  function scrollToBottom (){
    //selectors
    var messages = jQuery('#messages');
    var newMessage = messages.children("li:last-child");
    //Heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight>= scrollHeight){
      messages.scrollTop(scrollHeight);
    }
  }

  socket.on("connect",function (){
    console.log("successful to connect to server");

  });

  socket.on("disconnect",function (){
    console.log("disconnect from server");
  });


  socket.on('newMessage',function (message){
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = $("#message-template").html();
    var html = Mustache.render(template,{
      text:message.text,
      from:message.from,
      createdAt:formattedTime
    });

    $("#messages").append(html);

    scrollToBottom();

    //
    // var li = jQuery('<li></li>');
    // li.text(`${message.from} ${formattedTime}: ${message.text}`);
    //
    // jQuery("#messages").append(li);
  });

  socket.on("newLocationMessage",function (message){
    var template = $("#location-message-template").html();
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var html = Mustache.render(template,{
      from: message.from,
      createdAt: formattedTime,
      url: message.url
    });
    $("#messages").append(html);
    scrollToBottom();
    // li.text(`${message.from} ${formattedTime}: `);
    // a.attr("href",message.url);
    // li.append(a);
    // $("#messages").append(li);
  });




  $("#message-form").on('submit',function(e){
    e.preventDefault();

    var messageTextbox = $("[name=message]");

    socket.emit("createMessage",{
      from:"User",
      text: messageTextbox.val()
    },function (){
      messageTextbox.val('');
    });
  });

  var locationButton = $("#send-location");

  locationButton.on("click",function (){
    if(!navigator.geolocation){
      return alert("Geolocation not supported by your browser.");
    }

    locationButton.prop('disabled',true).text("Sending Location");

    navigator.geolocation.getCurrentPosition(function (position){
      locationButton.removeAttr('disabled').text("Send Location");

      socket.emit("createLocationMessage",{
        latitude:position.coords.latitude,
        longitude:position.coords.longitude
      })
    },function (){
      locationButton.removeAttr('disabled').text("Send Location");
      alert("unable to fetch location.");
    },{
      timeout:10000
    });
  });
});
