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
//From lab 12
// Gives access to data inside products_data.js
app.use(express.urlencoded ({extended: true }));

// Get the quanitity data from the order form, then check it and if all good send it to the invoice, if not send the user back to purchase page
app.post("/process_form", function (request, response, next) {
    let POST = request.body;

    // Checks if quantities are valid (nonnegint and have inventory)
    // this object holds errors the server finds
    var errors = {};

    // For loop for quantities 
    for(i in request.body.quantity) {
        // Checks if there are NonNegInt
        // Borrowed from lab 12
        if(isNonNegInt(request.body.quantity[i]) == false) { //
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


// Register  & Login section
// From lab 14
var filename = 'user_data.json'; 
if (fs.existsSync(filename)) {
    var user_data_string = fs.readFileSync(filename, 'utf-8');
    var users_reg_data = JSON.parse(user_data_string) 

    var file_stats = fs.statSync(filename);
    console.log(`${filename} has ${file_stats.size} characters`);
    //have reg data file, so read data and parse into user_registration_info object
} else {
    console.log(`Hey! ${filename} doesn't exist`);
}

app.get("register.html", function (request, response) {
    let params = new URLSearchParams(request.query);
    response.redirect("register.html?" + params);
});

app.post("register.html", function (request, response) {
    //Register Form
    //Gets information from textboxes
    let new_user_full_name = request.body['name'].replace(/#/g, "%20");
    let new_user_email = request.body['email'].toLowerCase().replace(/#/g, "%20");
    let new_user_username = request.body['username'].toLowerCase().replace(/#/g, "%20");
    let new_user_password = request.body['password'];
    let new_user_repeat_password = request.body['reentered_password'];
    
    let params = new URLSearchParams(request.query);
    
    var quantities_string = "";
    for (i in products_array) {
        quantities_string += `&quantity${i}=` + params.get(`quantity${i}`);
    }
    //Used to make form fields sticky
    let querystring = "register.html?";
    querystring += quantities_string + "&name=" + new_user_name + "&email=" + new_user_email + "&username=" + new_user_username;

    //VALIDATIONS: Form Fields
    let has_error = false; //initialize has_error to say there are no errors before any checking

    //Check FULL NAME field: something is entered
    if (isEmptyField(new_user_name) == true) {
        querystring += "&name_error=true"
    };
    
    //Check FULL NAME field: only letters are used 
    //This is adapted from https://www.w3resource.com/javascript/form/all-letters-field.php
    var only_letters = /^[A-Za-z ]+$/; 
    if (!new_user_name.match(only_letters)) {
        has_error = true;
        querystring += "&name_syntax_error=true"
    };
    //Check FULL NAME field: entered value is less than 30 characters
    if (new_user_name.length > 30) {
        has_error = true;
        querystring += "&name_length_error=long"
    };

    //Check EMAIL field: something is entered
    if (isEmptyField(new_user_email) == true) {
        querystring += "&email_error=true"
    };
    //Check EMAIL field: correct email formatting
    //Referenced from https://www.w3resource.com/javascript/form/email-validation.php
    var correct_mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; 
    if (!new_user_email.match(correct_mailformat)) {
        has_error = true;
        querystring += "&email_format_error=true"
    };

    //Check USERNAME field: something is entered
    if (isEmptyField(new_user_username) == true) {
        querystring += "&username_error=true"
    };
    //Check USERNAME field: only letters and numbers are used 
    var only_letters_and_numbers = /^[A-Za-z0-9]+$/; //referenced from https://www.w3resource.com/javascript/form/all-numbers.php
    if (!new_user_username.match(only_letters_and_numbers)) {
        has_error = true;
        querystring += "&username_syntax_error=true"
    };
    //Check USERNAME field: entered value is greater than 4 characters long
    if (new_user_username.length < 4) {
        has_error = true;
        querystring += "&username_length_error=short"
    };
    //Check FULL NAME field: entered value is less than 10 characters
    if (new_user_username.length > 10) {
        has_error = true;
        querystring += "&username_length_error=long"
    }
    //Check USERNAME field: make sure username isn't taken by another user
    if (typeof users_reg_data[new_user_username] !== 'undefined') {
        has_error = true;
        querystring += "&username_exists=true"
    };

    //Check PASSWORD field: something is entered
    if (isEmptyField(new_user_password) == true) {
        querystring += "&password_error=true"
    };
    //Check PASSWORD field: entered value is greater than 6 characters
    if (new_user_password.length < 6) {
        has_error = true;
        querystring += "&password_length_error=short"
    }

    //Check REPEAT PASSWORD field: matches the password in the previous field
    if (new_user_repeat_password !== new_user_password) {
        has_error = true;
        querystring += "&password_match_error=true"
    }


    if (has_error) { 
        //Redirect back to registration page if thre is an error 
        response.redirect(querystring + "&attempted_registration=true"); 
    } else { 
        //If registration fields are correct and pass the validations, then add the information to the user_data.json file
        users_reg_data[new_user_username] = {};
        users_reg_data[new_user_username].name = new_user_name;
        users_reg_data[new_user_username].password = new_user_password;
        users_reg_data[new_user_username].email = new_user_email;
        //Null,2 keeps the formatting of json. 
        fs.writeFileSync(filename, JSON.stringify(users_reg_data, null, 2)); 

        //If registration passes ten leads to login page
        response.redirect("login.html" + params + "&registration_successful=true"); 
    };
});

//Return to shopping button on Invoice page
app.get('/back', function (request, response, next) {
    response.redirect("products_display.html");
});

// Routes to the public folder
app.use(express.static('./public'));

// Litens to the server
app.listen(8080, () => console.log(`listening on port 8080`));