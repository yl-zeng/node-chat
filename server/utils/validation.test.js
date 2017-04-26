const expect = require("expect");

const {isRealString} = require("./validation.js");


describe("isRealString",()=>{
  it("should reject non-string values",()=>{
    var res = isRealString(107);
    expect(res).toBe(false);
  });

  it("should reject string with only spaces",()=>{
    var res = isRealString("    ");
    expect(res).toBe(false);
  });

  it("should allow string with non-space character",()=>{
    var res = isRealString("  FSDA  ");
    expect(res).toBe(true);
  });

});
