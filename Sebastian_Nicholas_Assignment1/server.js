// Nicholas Sebastian
// Assignment 1
// Main server for Assignemnet 1

// Server.js starts the code for the webpage
// Most Code in Server.js is borrowed from lab 12 & lab 11

// Variables & Express
var product_data = require('./products_data.json');
var express = require('express'); 
var app = express(); 
var querystring = require("querystring");


app.use(express.urlencoded({ extended: true }));

// Accepts all paths/requests
app.all('*', function (request, response, next) {
    console.log(request.method + ' to path ' + request.path + 'with query' + JSON.stringify(request.query));
    next();
});

// Get Method to get data from the products_data.js
app.get('/products_data.json', function (request, response, next) {
    response.send('in test: ' + request.method + ' to path ' + request.path);
});

// Post method & Validation 
// Process purchase request
app.post('/purchase', function (request, response, next) {
    // Variables used for validation
    let textbox = false; // Represents amount put into textbox
    var errors = {}; // Start with empty cart
    var qString = qs.stringify(request.body);
    // Checks all entered quantities
    for (i in products_array) {
        q = request.body['quantity' + i];
        // If the quantity is invalid
        if (isNonNegInt(q) == false) {
            errors['invalid_quantity' + i] = `${q} is not a valid input`;
        }
        // If quantity is greater than 0
        if (q > 0) {
            textbox = true;
        }
        // If quantity input is greater than quantity available
        if (q > products_array[i].quantity) {
            errors['quantity' + i] = `${q} of ${products_array[i].name} is not available. Only ${products_array[i].quantity} are available.`;
        }
    }
    // No quantities were selected
    if (textbox == false) {
        errors['no_quantities'] = `Please input your quantity.`;
    }
 
    // Code borrowed and modified from 
    // If no errors go to invoice, if errors go back to products
    if (Object.keys(errors).length == 0) {
       // If purchase is valid, we remove from quantity available, the refreshes page with new quantity available
       for (i in products_array) {
           products_array[i].quantity -= Number(request.body['quantity' + i]);
       }
       // Goes to invoice upon valid purchase
       response.redirect("./invoice.html?" + qString); 
   }
    else {
        // Makes an error message from all errors.
        var err_msg = '';
        for (err in errors) { err_msg += errors[err] + `\n`}
        // Goes back to product display if wrong
        response.redirect(`./products_display.html?errorMessage=${err_msg}&` + qString); 
    }
 });

// function checks for errors & non-negative integers 
function isNonNegInt(q, returnErrors=false) {
    errors = []; 
        if(Number(q) != q) errors.push('Not a number!'); 
            else {
                if(q < 0) errors.push('Negative value!'); 
                    if(parseInt(q) != q) errors.push('Not an integer!'); 
    }   

    return (returnErrors ? errors : (errors.length == 0));
    }

// Gets all request from public
app.use(express.static('./public'));

app.get("/products_data.json", function (request, response, next) {
   response.type('.js');
   var products_str = `var product__data = ${JSON.stringify(products_array)};`;
   response.send(products_str);
});

// starts the server
app.listen(8080, () => console.log(`listening on port 8080`));