// Nicholas Sebastian
// Assignment 1
// Main server for Assignemnet 1

// Server.js starts the code for the webpage
// Most Code in Server.js is borrowed from lab 12 & lab 11

// Variables & Express
var products_array = require('./products.json');
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
app.get('/products_data.js', function (request, response, next) {
    response.send('in test: ' + request.method + ' to path ' + request.path);
});

// Post method & Validation 
//app.post('/process_form', function (request, response, next) {
    
        //}


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

app.get("/products.js", function (request, response, next) {
   response.type('.js');
   var products_str = `var products_array = ${JSON.stringify(products_array)};`;
   response.send(products_str);
});

// starts the server
app.listen(8080, () => console.log(`listening on port 8080`));