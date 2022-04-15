// Nicholas Sebastian
// Assignment 1
// Main server for Assignemnet 1

// Server.js starts the code for the webpage
// Most Code in Server.js is borrowed from lab 12 & lab 11

// Variables & Express
var express = require('express'); 
var app = express(); 
var products_array = require('./products_data.json');
var products = products_array;
var querystring = require("querystring");
var temp_qty_data = {};
// Monitors all requests
app.all('*', function (request, response, next) {
    console.log(request.method + ' to' + request.path);
    next();
});

//Get request for products data
app.get('/products_data.json', function (request, response) {
    response.type('.js');
    var products_str = `var products = ${JSON.stringify(products)};`;
    response.send(products_str);
});

// Borrowed from Lab 12
// Validates data
function isNonNegInt(q, returnErrors = false) {
    errors = []; // assume no errors at first
    if (q == '') q = 0;
        if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value. 
            else {
                if(q>10) errors.push('Not enough in stock. '); //checks quanitity
                    if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
                        if (parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer

    }
    return returnErrors ? errors : (errors.length == 0);
}

// Register  & Login section ------------------------------------------------------------------------------------------
var fs = require('fs');
var filename = './user_data.json';
// This  object will hold our quantites when we move to the login/register page
var temp_qty_data = {};

if (fs.existsSync(filename)) {
    var data = fs.readFileSync(filename, 'utf-8');
    var user_data = JSON.parse(data);
    //if the file does not exists, the console willl show the nme of the file, and tell the file is not exist.
    }else{
        console.log(`${filename} does not exist!`);
  }
  
//From lab 13 
//to access inputted data from product_data.js
app.use(express.urlencoded ({extended: true }));
  
// Login Page ---------------------------------------------------------------------------------------------------------
app.post("/process_login", function (req, res) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    var the_username = req.body.username.toLowerCase(); 
    
    // Cheks for Matching username
    if (typeof user_data[the_username] != 'undefined') { 
        // If passes then redirect to the invoice page
        if (user_data[the_username].password == req.body.password) { 
            // Put the stored quanity data into the query
            // Adds username to the query
            // Stores user information in temp_qty_data
            let params = new URLSearchParams(temp_qty_data); 
            params.append('username', the_username); 
            params.append('email', user_data[the_username].email); 
            res.redirect('invoice.html' + params.toString());
        return;
    
    } else { 
        // If the password has error, push an error
        req.query.username = the_username;
        req.query.LoginError = 'Invalid Password';
        }
    } else { 
        // If the username has error, push an error 
        req.query.LoginError = 'Invalid Username';
}
params = new URLSearchParams(req.query);
// Redirects back to login page if there is an error
res.redirect('login.html' + params.toString());
});
    
    
// Register Page -------------------------------------------------------------------------------------------------------
// Checks for valid information
app.post("/process_register", function (req, res) {
    console.log(req.body);

    // Object sets errors to 0
    var reg_errors = {};
    // Sets usernames to lowcase
    var reg_username = req.body.username.toLowerCase(); 
    
    // Full name validation 
    // Checks if name is correct 
    if (/^[A-Za-z, ]+$/.test(req.body.fullname)) { 
        }else{
        // Checks if name has any errors
        reg_errors['fullname'] = 'Only Letters allowed for Full Name (Ex. Alex Smith)';
    }

    // Checks if name is between 30 and 1 charactes 
    if (req.body.fullname.length > 30 && req.body.fullname.length < 1) { 
        // If character length does not match
        reg_errors['fullname'] = 'Fullname must contain Maximum 30 Characters';
    }
    
    // Username validation 
    // Check if the length of username is less than 4 or greater than 10
    if (req.body.username.length > 10 || req.body.username.length < 4) { 
        // if enter invalid length, put wrong
        reg_errors['username'] = 'Minimum of 4 characters and maximum of 10 characters';
    }
      
    // Checks if username is avaliable 
    if (typeof user_data[reg_username] != 'undefined') { 

        reg_errors['username'] = 'This username is already taken!';
    }
    
    // Checks if the username is empty or not
    if (typeof user_data[reg_username] == '') { 
        // Outputs if there is an error
        reg_errors['username'] = 'You need a username!'; 
    }
    
    // Checks if username only has letterss and numbers
    if (/^[0-9a-zA-Z]+$/.test(req.body.username)) {
      }else{
        //if the user enter a wrong username, show this
        reg_errors['username'] = 'Username is Letters and Numbers Only (Ex. Abc123)';
    }
    
    // Email validation 
    // Setup email limitations (from w3resource https://www.w3resource.com/javascript/form/email-validation.php)
    // Email only allows certain characters
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(req.body.email)) {
      }else{
        // Outputs error message 
        reg_errors['email'] = 'Must enter a valid email (Ex. username@mailserver.domain).';
    }
    
    // Password validation 
    //Checkls if password length is to be 7 characters or more
    if (req.body.password.length < 7) {
        // Outputs error message
        reg_errors['password'] = 'Minimum: 7 Characters';
    }
    
    // Repeat Password validation 
    // Checks if the repeat password is matching password
    if (req.body.password !== req.body.repeat_password) {  
        // Outputs error message
        reg_errors['repeat_password'] = 'Repeat password not the same as password!';
    }
    
    // If no errors then save new user and redirect to invoice, otherwise back to registration form and note errors
    if (Object.keys(reg_errors).length == 0) {
        //If user enterd valid information, then save and store in JSON file 
        console.log('no errors')
        var username = req.body['name'].toLowerCase();
        user_data[username] = {};
        user_data[username]["name"] = req.body['fullname'];
        user_data[username]["password"] = req.body['password'];
        user_data[username]["email"] = req.body['email'];
    
        fs.writeFileSync(filename, JSON.stringify(user_data), "utf-8");
        // Put the stored quanitiy data into the temp_qty_data
        //get the username and email from the register information
        let params = new URLSearchParams(temp_qty_data);
        // Adds the username to the query
        params.append('username', username); 
        // Adds email to the query
        params.append('email', user_data[username].email); 
        // Send the user to invoice page with query string
        res.redirect('invoice.html' + params.toString());
    }else{
        //if error occurs, redirect back to register page
        req.body['reg_errors'] = JSON.stringify(reg_errors);
        let params = new URLSearchParams(req.body);
        res.redirect('register.html' + params.toString());
      }
    });

    // Get the quanitity data from the order form, then check it and if all good send it to the invoice, if not send the user back to purchase page
    app.post("/process_form", function (request, response, next) {
    let POST = request.body;

    // Checks if quantities are valid (nonnegint and have inventory)
    // This object holds errors the server finds
    var errors = {};

    // For loop for quantities 
    for(i in request.body.quantity) {
        // Checks if there are NonNegInt
        // Borrowed from lab 12
        if(isNonNegInt(request.body.quantity[i]) == false) { 
            console.log(`${request.body.quantity[i]} is not a valid quantity for ${products[i].brand}`);
            errors['quantity'+i] = `${request.body.quantity[i]} is not a valid quantity for ${products[i].brand}`;
        }

        // Checks if we have enough products in stock
        if(request.body.quantity[i]>products[i].inventory){
            errors['inventory'+i] = `Stock does not have ${request.body.quantity[i]} pairs for ${products[i].brand}`;
    }
        // Checks if quantities has a value
        if(request.body.quantity[i]>0){
            var has_quantities = true;
        }
    }
    // Checks if quantities are undefined/not made
    if(typeof has_quantities == 'undefined') {
        errors['no_quantities'] = `You need to make selection`;
    }
    
    // Query string for quantaties 
    let qty = {"quantity": JSON.stringify(request.body.quantity)};

    // If data is valid, create invoice
    if(Object.keys(errors).length === 0) {
    // Valid purchases move quanitites to Invoice
        for(i in request.body.quantity){
            products[i].inventory -= Number(request.body.quantity[i]);
        }
        // Redirects to Register Page
        response.redirect('./register.html' + querystring.stringify(qty));
    } else {
        // Redirects back to products display
        qty.errors = JSON.stringify(errors);
            response.redirect('./products_display.html' + querystring.stringify(qty) + '&err_obj='+qty.errors);
   }
});

// Routes to the public folder
app.use(express.static('./public'));

// Litens to the server
app.listen(8080, () => console.log(`listening on port 8080`));