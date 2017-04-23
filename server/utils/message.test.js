
const expect = require("expect");
var {generateMessage,generateLocationMessage} = require("./message.js");


describe("generateMessage",()=>{
  it("should generate correct message",()=>{
    var from = "Jen";
    var text = "some message";
    var message = generateMessage(from,text);
    expect(message).toInclude({
      from,
      text
    });
    expect(message.createdAt).toBeA("number");
  });
});


describe("generateLocationMessage",()=>{
  it("should generate correct location object",()=>{
    var lat = 40;
    var log = 50;
    var message = generateLocationMessage("Admin",lat,log);
    var url = "https://www.google.com/maps?q=40,50";
    expect(message.createdAt).toBeA("number");
    expect(message).toInclude({
      from:"Admin",
      url
    });
  });


});
