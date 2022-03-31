var users_reg_data = require("./user_data.json");

// Ex1a
var filename = "./user_data.json";
const fs = require("fs");
var data = fs.readFileSync(filename, 'utf-8');
var users =JSON.parse(data);
console.log(users["the kazman"].password);


// Ex1b
// console.log(users_reg_data ["kazman"]["password"]);