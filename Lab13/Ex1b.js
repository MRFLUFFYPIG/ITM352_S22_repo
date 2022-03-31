var users_reg_data = require("./user_data.json");

// Ex1a
const fs = require("fs");

//Ex2a
if (fs.existsSync(filename)) {
    // Ex2b
    let stats = fs.statSync(filename);
     // Ex2b
    console.log(`${filename} jas  ${stats.size} characters`);
    var filename = "./user_data.json";
    var data = fs.readFileSync(filename, 'utf-8');
    var users =JSON.parse(data);
        if(typeof users["kazman"] != 'undefined') {
            console.log(users["kazman"].password);
        }
}else{
    console.log(`${filename} does not exist!`)
}



// Ex1b
// console.log(users_reg_data ["kazman"]["password"]);