
const validator = require("validator");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

const bcrypt = require("bcryptjs");

var UserSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
    trim: true,
    minlength:1,
    unique: true
  },
  password:{
    type: String,
    required: true,
    minlength: 6
  },
  tokens:[{
    access:{
      type: String,
      required: true
    },
    token:{
      type: String,
      required: true
    }
  }]
});


//override
UserSchema.methods.toJSON = function (){
  var user = this;
  var userObject = user.toObject();
  return _.pick(userObject,["_id","name"]);
}

UserSchema.methods.generateAuthToken = function (){
  var access = "auth";
  var user = this;
  var token = jwt.sign({_id:user._id.toHexString(),access},process.env.JWT_SECRET).toString();
  user.tokens.push({access,token});
  return user.save().then(()=>{
    return token;
  });

};

// instance method
UserSchema.methods.removeToken = function(token){
  var user = this;

  return user.update({
    $pull:{
      tokens:{
        token:token
      }
    }
  });
}


UserSchema.statics.findByToken = function (token){
  var User = this;    // model
  var decoded;

  try{
    decoded = jwt.verify(token,process.env.JWT_SECRET);
  }catch(e){
    return new Promise((resolve,reject)=>{
      reject("401 need authentication");
    });
  }
  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': decoded.access
  })
}

UserSchema.statics.findByCredentials = function (name,password){
  var User = this;
  return User.findOne({name}).then((user)=>{
    if(!user){
      return Promise.reject();
    }
    return new Promise((resolve,reject)=>{
      bcrypt.compare(password,user.password,(err,res)=>{
        if(res){
          resolve(user);
        }else{
          reject();
        }
      });
    });
  });
}

UserSchema.pre('save',function (next){
  var user = this;

  if(user.isModified("password")){
    bcrypt.genSalt(10,(err,salt)=>{
      bcrypt.hash(user.password,salt,(err,hash)=>{
        user.password = hash;
        next();
      });
    });
  }else{
    next();
  }
})


var User = mongoose.model("User",UserSchema);

module.exports = {User};
