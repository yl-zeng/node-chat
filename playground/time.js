var moment = require("moment");


var date = moment();
date.add(100,'y').subtract(9,"M");
console.log(date.format('MMM Do, YYYY'));
