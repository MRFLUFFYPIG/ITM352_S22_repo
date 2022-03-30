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
        // Redirects to invoice page
        response.redirect('./invoice.html?' + querystring.stringify(qty));
    } else {
        // Redirects back to products display
        qty.errors = JSON.stringify(errors);
            response.redirect('./products_display.html?' + querystring.stringify(qty) + '&err_obj='+qty.errors);
   }
});

// Allows routing to the public folder
app.use(express.static('./public'));

// Litens to the server
app.listen(8080, () => console.log(`listening on port 8080`));