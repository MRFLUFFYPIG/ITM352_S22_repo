//This is server for the store app, based on lab13 and screencast 
//borrow this from Xinfei
var express = require('express');
var app = express();
var myParser = require("body-parser");
var data = require('./product_data.js');
var products = data.products;
// loads starts up fs system actions
var fs = require('fs');
//set filename equal to user data.json
var filename = './user_data.json';
var querystring = require("querystring");
// used to store quantity data from products disiplay page
var temp_qty_data = {};


// Monitors all requests
app.all('*', function (request, response, next) {
    console.log(request.method + ' to' + request.path);
    next();
});

//Get request for products data
app.get('/product_data.js', function (request, response) {
    response.type('.js');
    var products_str = `var products = ${JSON.stringify(products)};`;
    response.send(products_str);
});

//code from lab 12
//helps to check validate data
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
if (fs.existsSync(filename)) {
  var data = fs.readFileSync(filename, 'utf-8');
  var user_data = JSON.parse(data);
  //if the file does not exists, the console willl show the nme of the file, and tell the file is not exist.
} else {
  console.log(`${filename} does not exist!`);
}

//From lab 13 
//to access inputted data from product_data.js
app.use(express.urlencoded ({extended: true }));

  
  // -------------- Login -------------------- //
  //this process the login form
  app.post("/process_login", function (req, res) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    var the_username = req.body.username.toLowerCase(); //username in lowercase
  
    if (typeof user_data[the_username] != 'undefined') { //matching username
      if (user_data[the_username].password == req.body.password) { //if all the info is correct, then redirect to the invoice page
        // Put the stored quanity data into the query
        //add username to query to know who's login
        //to get the username and email from the informaation that user entered, and store it in the temp_qty_data
        let params = new URLSearchParams(temp_qty_data); //put the temp_qty_data inside the params
        params.append('username', the_username); // add the username to the query
        params.append('email', user_data[the_username].email); // add email to the query
        res.redirect('/invoice.html?' + params.toString());//if good to go, send to invoice page with the username and email to the string
        return;
  
      } else { //if the password has error, push an error
        req.query.username = the_username;
        req.query.LoginError = 'Invalid Password';
      }
    } else { //if the username has error, push an error 
      req.query.LoginError = 'Invalid Username';
  
    }
    params = new URLSearchParams(req.query);
    res.redirect('./login.html?' + params.toString());//redirect to login page if there is a error
  });
  
  
  // -------------- Register --------------------//
  //to make sure the user put in valid information
  app.post("/process_register", function (req, res) {
    console.log(req.body);
    // assume no register errors from the start, so set no register errors 
    var reg_errors = {};
  
    var reg_username = req.body.username.toLowerCase(); //register username in lowercase
  
    // -------------- Full name validation -------------- //
    if (/^[A-Za-z, ]+$/.test(req.body.fullname)) { //check if the fullname is correct
    }
    else {
      reg_errors['fullname'] = 'Only Letters allowed for Full Name (Ex. Alex Smith)';// if there is a error, show this
    }
  
    if (req.body.fullname.length > 30 && req.body.fullname.length < 1) { //check if the length is less than 1 or greater than 30
      reg_errors['fullname'] = 'Fullname must contain Maximum 30 Characters';// if enter invalid length, put wrong
    }
  
    // -------------- Username validation -------------- //
    if (req.body.username.length > 10 || req.body.username.length < 4) { //check if the length of username is less than 4 or greater than 10
      reg_errors['username'] = 'Minimum of 4 characters and maximum of 10 characters';// if enter invalid length, put wrong
    }
  
    if (typeof user_data[reg_username] != 'undefined') { //check if the username is taken or not
      reg_errors['username'] = 'This username is already registered!';//if the username is taken, show this
    }
  
  
    if (typeof user_data[reg_username] == '') { //check if the username is empty or not
      reg_errors['username'] = 'You need a username!'; // if invalid, show this
    }
  
    if (/^[0-9a-zA-Z]+$/.test(req.body.username)) {//username only letter and number
    }
    else {
      reg_errors['username'] = 'Username is Letters and Numbers Only (Ex. Abc123)';//if the user enter a wrong username, show this
    }
  
    // -------------- Email validation -------------- //
    // Setup email limitations (from w3resource https://www.w3resource.com/javascript/form/email-validation.php)
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(req.body.email)) {// Email only allows certain character for x@y.z
    }
    else {
      reg_errors['email'] = 'Must enter a valid email (Ex. username@mailserver.domain).';//otherwise, show this to the user
    }
  
    // -------------- Password validation -------------- //
    if (req.body.password.length < 6) {//password length need to be 6 characters or more
      reg_errors['password'] = 'Minimum: 6 Characters';// otherwise, show this
    }
  
    // -------------- Repeat Password validation -------------- //
    if (req.body.password !== req.body.repeat_password) {  // check if the repeat password is matching password
      reg_errors['repeat_password'] = 'Repeat password not the same as password!';// if not, show this
    }
  
    // If no errors then save new user and redirect to invoice, otherwise back to registration form and note errors
    if (Object.keys(reg_errors).length == 0) {
      //If user enterd valid information, then save and store in JSON file 
      console.log('no errors')
      var username = req.body['username'].toLowerCase();
      user_data[username] = {};
      user_data[username]["name"] = req.body['fullname'];
      user_data[username]["password"] = req.body['password'];
      user_data[username]["email"] = req.body['email'];
  
      fs.writeFileSync(filename, JSON.stringify(user_data), "utf-8");
      // Put the stored quanitiy data into the temp_qty_data
      //get the username and email from the register information
      let params = new URLSearchParams(temp_qty_data);
      params.append('username', username); // add the username to the query
      params.append('email', user_data[username].email); // add email to the query
      res.redirect('/invoice.html?' + params.toString());// if good to go, send the user to invoice page with query string
    }
  
    //if error occurs, redirect to register page
    else {
      req.body['reg_errors'] = JSON.stringify(reg_errors);
      let params = new URLSearchParams(req.body);
      res.redirect('register.html?' + params.toString());
    }
  });


// Get the quanitity data from the order form, then check it and if all good send it to the invoice, if not send the user back to purchase page
app.post("/process_form", function (request, response) {
    
    let POST = request.body;

    // check to make user inputs some value

   // check is quantities are valid (nonnegint and have inventory)
   var errors = {};//this will create object with nothing in it ro store errors if we find any

    //loop through all the quantitiy and see if there is any error
    for(i in request.body.quantity) {
        //this will recognize if there are any isnonnegint
        if(isNonNegInt(request.body.quantity[i]) == false) { //
            console.log(`${request.body.quantity[i]} is not a valid quantity for ${products[i].brand}`);
            errors['quantity'+i] = `${request.body.quantity[i]} is not a valid quantity for ${products[i].brand}`;
        
        }
        // this check if we have enough inventory
        if(request.body.quantity[i]>products[i].inventory){
            errors['inventory'+i] = `We do not have ${request.body.quantity[i]} products in stock for ${products[i].brand} sorry for inconvenience ` ;
          
    }
    //did they select any value
    if(request.body.quantity[i]>0){
        var has_quantities = true;
    }
}
    // If has_quanties is undfined, no quantities were selected
    if(typeof has_quantities == 'undefined') {
        errors['no_quantities'] = `You need to make selection`;
    }
    
    // create query string of all the quantities
   let qty_obj = {"quantity": JSON.stringify(request.body.quantity)};

    //If data is valid, create invoice
   if(Object.keys(errors).length === 0) {
    //purchase is valid remove quatities from inventory
      for(i in request.body.quantity){
          products[i].inventory -= Number(request.body.quantity[i]);
      }
      temp_qty_data = qty_obj; // save the quantity data for later
    response.redirect('./login.html?');
   } else {
    qty_obj.errors = JSON.stringify(errors);
    response.redirect('./products_display.html?' + '&err_obj='+qty_obj.errors);
   }
   
});



//route all other GEt requests to files in the public folder. 
app.use(express.static('./Public'));

app.listen(8080, () => console.log(`listening on port 8080`)); // note the use of an anonymous function here to do a callback