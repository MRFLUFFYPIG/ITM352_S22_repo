// Author Nicholas Sebastian
// Date May 3rd, 2022
// Individual Requirement IR7
/*
Description of Page:
This page is responsible for all server processing of incoming and outgoing requests utilizing different routes. 
*/

// Code is referenced, copied, and modified from Kyle McWhirter (Spring 2022), Emily MelChor (Assignment 1, Fall 2021), and some code is referenced from my own Assignemnt 1 & 2. 


// Express Packages; allows middleware & http routing.
var express = require('express');
var app = express();

// File system module; allows the server to work with files on the computer 
var fs = require('fs');

// Product array for product data in products_data.json
var products_data = require(__dirname + '/products_data.json');

// Cookie Parse for cookies 
var cookieParser = require('cookie-parser');
app.use(cookieParser());

// Session package 
var session = require('express-session');
// USE function to utilize input data from pages 
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: "MySecretKey", resave: true, saveUninitialized: true }));

// Mailer 
var nodemailer = require('nodemailer');


//-----------------------------------------------------------------------------//
// Request Section //
//-----------------------------------------------------------------------------//

// ALL function which deals with all functions 
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
    request.sessionStore.all((e, sessions) => {

        //-------------------------------------------------------------------------------------------------//
        // IR7 - different sessions for multiple carts 
        // Had help from Professor Port 
        // Loop for products_data
        //-------------------------------------------------------------------------------------------------//
        for (let pkey in products_data) {
            for (let i in products_data[pkey]) {
                // Start with 0 items in the carts 
                products_data[pkey][i].total_in_carts = 0;
            }
        }

        // session for carts 
        for (let s_id in sessions) {
            if (typeof sessions[s_id].cart != 'undefined') {
                for (let pkey in sessions[s_id].cart) {
                    for (let i in sessions[s_id].cart[pkey]) {
                        products_data[pkey][i].total_in_carts += Number(sessions[s_id].cart[pkey][i]);
                    }
                }
            }
        }
        //-------------------------------------------------------------------------------------------------//
    });
});

// GET function which gets data from the products_data.json file
app.get("/products_data.js", function (request, response) {
    response.type('.js');
    var products_str = `var products_array = ${JSON.stringify(products_array)};`;
    response.send(products_str);
});

// GET product data from the server 
app.post("/get_products_data", function (request, response) {
    response.json(products_data);
});

//-----------------------------------------------------------------------------//
// Cart Section
//-----------------------------------------------------------------------------//

// sends cart data from the server to each page that requests
app.post("/get_cart", function (request, response) {
    if (typeof request.session.cart == 'undefined') {
        request.session.cart = {};
    }
    response.json(request.session.cart);
});

//-----------------------------------------------------------------------------//
// User Section
//-----------------------------------------------------------------------------//

app.post("/get_user_info", function (request, response) {
    console.log(request.session.email);
    let uinfo = { name: "Login", email: "" };
    if (typeof request.session.email != 'undefined') {
        uinfo.email = request.session.email;
        uinfo.name = user_reg_info[request.session.email].name;
    }
    console.log(uinfo)
    response.json(uinfo)
});

app.get("/use_session", function (request, response) {
    console.log(request.session);
    response.send(`welcome, your session ID is ${request.session.id}`);
});



//-----------------------------------------------------------------------------//
/* For this section it is a mix of borrowed code from Emily Melchor and Kyle McWhirter */
// Kyle McWhirter also helped me with implementing this code to my server & assisted me with my Assignment 3

// Checkout/Purchase //
// This section handles product quantities 
//-----------------------------------------------------------------------------//

// Post method for product quantities, routes valid quantities to the server and returns errors if an invalid quantity is inputted.
app.post("/process_form", function (request, response) {
    console.log(request.body);
    var errors = []; //start with no errors
    var has_quantity = false; //start with no quantity
    var products_key = Object.keys(request.body["quantity_textbox"])[0]; // get the product key sent from the form post
    var quantity = request.body['quantity_textbox'][products_key]; // Get quantities from the form post and convert strings from form post to numbers
    //use loop to validate all product quantities
    for (i in quantity) {
        // create query string from request.body
        const qstring = `purchase_order=Cart&quantities=${JSON.stringify(quantity)}`;
        //check if there is a quantity; if not, has_quantity will still be false
        if (isNonNegInt(quantity[i]) == false) {
            errors['invalid_quantity'[i]] = `${quantity[i]} is not a valid quantity for ${products_data[products_key][i].name} \n`;
        }

        //check if there is enough in inventory
        //access quantity_available from json file
        let inventory = products_data[products_key][i].quantity_available;

        //if quantity ordered is less than or same as the amount in inventory, reduce inventory by quantity ordered amount 
        if (Number(quantity[i]) <= inventory) {
        }
        //if there's not enough in inventory, add error (quantity too large)
        if (quantity[i] > inventory) {
            errors[`invalid_quantity`[i]] = `Please order a smaller amount of ${products_data[products_key][i].name}! \n`;
        }

        if (quantity[i] > 0) {
            var has_quantity = true;
        }
    }
    //if there are no quantities, send back to order page with message (need quantities)
    if (!has_quantity) {
        errors['no_quantities'] = 'Please enter a quantity! \n';
    }

    //if there's no errors, add quantities to cart
    if (Object.keys(errors).length === 0) {
        for (products_key in request.body['quantity_textbox']) {
            for (i in quantity) {
                products_data[products_key][i].quantity_available -= Number(quantity[i]); // remove inventory for this item
                console.log(`${products_data[products_key][i].quantity_available} is new inventory amount`);
                if (typeof request.session.cart == 'undefined') {
                    request.session.cart = {};
                }
                if (typeof request.session.cart[products_key] == 'undefined') {
                    request.session.cart[products_key] = [];
                }
                request.session.cart[products_key][i] = quantity[i]; // add qty to cart
            }
        }
        response.redirect(`./products_display.html?products_key=ALLPRODUCTS`);
    }
    else {
        //if there is errors
        //generate error message based on type of error
        let error_string = ''; //start with empty error string
        for (err in errors) {
            //for each error, add error message to overall error_string
            error_string += errors[err];
        }
        //send back to order page with error message
        response.redirect(`./products_display.html?products_key=${products_key}&` + `&error_string=${error_string}`);
        console.log(`error_string=${error_string}`);
    }
});

//-----------------------------------------------------------------------------//
// Login Page //
// Kyle McWhirter also helped me with implementing this code to my server & assisted me with my Assignment 3
// This page checks for errors and validation for logging in.
//-----------------------------------------------------------------------------//

// user info JSON file
var filename = './user_data.json';
//start with user logged out
var user_logged_in = false;

// have login data file, so data is read and parsed into user_reg_info object
// function using fs to identify if user_data file exists, if does exist then parse | borrowed from Assignment2 examples

if (fs.existsSync(filename)) {
    data_str = fs.readFileSync(filename, 'utf-8');
    user_reg_info = JSON.parse(data_str);
    console.log(user_reg_info);
} else {
    console.log(filename + ' does not exist!');
}

// get method for user login, if credentials match send to invoice, if not send error messages.
app.post("/login", function (request, response) {
    // Redirect to invoice page if ok, back to login page if not
    let email = request.body.email;
    let login_password = request.body['password'];
    var log_errors = []; //start with no errors

    // check if email exists, if not alert
    if (typeof user_reg_info[email] == 'undefined') {
        log_errors['incorrect_email'] = `${email} does not exist, Sign up! \n`;
    }

    if (typeof user_reg_info[email] != 'undefined' && user_reg_info[email].password == login_password) {
        console.log('no log in errors');
    } else if (user_reg_info.password != login_password) {
        log_errors['incorrect_password'] = `Incorrect password for ${email}. Please try again. \n`;
    }
    let params = (new URLSearchParams());
    if (Object.keys(log_errors).length == 0) {
        user_logged_in == true;
        params.append('quantities', request.body.quantities)
        params.append('email', request.body.email)
        response.redirect('./products_display.html?' + params.toString());


        request.session['email'] = user_email;
        request.session['name'] = user_reg_info[user_email].name;
        // IR7
        request.session['cart'] = user_reg_info[user_cart].cart;
        // Outputs session back to log
        console.log(request.session);
        if (Object.keys(request.session.cart).length == 0) {
            response.redirect(`./products_display.html`);
            //else if user logs in and has products in cart, redirect to the cart
        } else {
            response.redirect(`./cart.html`);
        }
        return;
    } else {
        //generate login error message
        let log_error_string = '';
        for (err in log_errors) {
            log_error_string += log_errors[err];
        }
        //response.send(log_error_string);
        params.append('quantities', request.body.quantities)
        response.redirect('./login.html?' + `log_error_string=${log_error_string}&` + params.toString());
        console.log(`log_error_string=${log_error_string}`);
    }



});

//-----------------------------------------------------------------------------//
// Register Page 
// Kyle McWhirter also helped me with implementing this code to my server & assisted me with my Assignment 3
// This page stores new user information to the server and can be used in the login page.
//-----------------------------------------------------------------------------//

app.post("/register", function (request, response) {
    //define new email, password, repeat password
    //.toLowerCase makes case insensitive
    var email = request.body.email;
    var name = request.body.name;
    var password = request.body.password;
    var confirm_password = request.body.password2;
    var reg_errors = {}; //start with no errors

    //validate email value
    //Email length must be minimum 4 characters and maximum 30 characters
    if (email.length < 4 || email.length > 30) {
        reg_errors[`email`] = `Email must be between 4 and 20 characters. \n`;
    } else if (email.length == 0) {
        reg_errors[`email`] = `Enter an email. \n`;
    }

    //email cannot have symbols (only letters and numbers)
    //.match from https://stackoverflow.com/questions/3853543/checking-input-values-for-special-symbols
    // input pattern attributes for email validation from https://www.w3schools.com/TAGS/att_input_pattern.asp
    if (email.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/) == false) {
        reg_errors[`email`] = `Email can only consist of letters and numbers. \n`;
    }

    //email is already taken
    if (typeof user_reg_info[email] != 'undefined') {
        reg_errors[`email`] = `Email is already taken. \n`;
    }

    //validate name value
    //name cannot be more than 30 characters
    if (name == 'undefined') {
        reg_errors[`name`] = `Enter your full name. \n`;
    }
    else if (name.length > 30) {
        reg_errors[`name`] = `Name cannot be more than 30 characters. \n`;
    }

    //validate password value
    //password must be at least 8 characters minimum
    if (password == 'undefined') {
        reg_errors[`password`] = `Enter a password. \n`;
    } else if (password.length < 8) {
        reg_errors[`password`] = `Password is too short. \n`;
    }

    //confirm password
    if (confirm_password == 'undefined') {
        reg_errors[`passwordReenter`] = `Re-enter your password. \n`;
    } else if (password == confirm_password) {
        console.log('passwords match');
    } else {
        reg_errors[`passwordReenter`] = `Passwords do not match, please try again. \n`;
    }

    //validate email value
    if (email == 'undefined') {
        reg_errors[`email`] = `Enter your email. \n`;
    }
    //.match from https://www.w3resource.com/javascript/form/email-validation.php
    else if (email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
        console.log(`email is ${email}`);
    } else {
        reg_errors[`email`] = `Email is invalid. `;
    }
    let params = (new URLSearchParams());
    //if there's no errors, add registration info to user_data.json, log in user, and redirect to invoice
    if (Object.keys(reg_errors).length == 0) {
        user_reg_info[email] = {};
        user_reg_info[email].name = request.body.name;
        user_reg_info[email].password = request.body.password;
        fs.writeFileSync(filename, JSON.stringify(user_reg_info), "utf-8");
        user_logged_in == true;
        request.session.email = email;
        response.redirect(`./products_display.html?products_key=ALLPRODUCTS`);
    } else {
        //generate login error message
        let reg_error_string = '';
        for (err in reg_errors) {
            reg_error_string += reg_errors[err];
        }
        //response.send(reg_error_string) and quantities
        let params = (new URLSearchParams());
        params.append('quantities', request.body.quantities)

        response.redirect('./login.html?' + `&reg_error_string=${reg_error_string}&`);
        console.log(`reg_error_string=${reg_error_string} `);
    }
});

// Session for new accounts



//-----------------------------------------------------------------------------//
// Profile Edit Section 
// Kyle McWhirter also helped me with implementing this code to my server & assisted me with my Assignment 3
// This section allows the user to edit their user info
//-----------------------------------------------------------------------------//

app.post("/profile", function (request, response) {
    var email = request.body.email;
    var name = request.body.name;
    var password = request.body.password;
    var confirm_password = request.body.password2;
    var upd_errors = {}; //start with no errors

    // If email does not exist
    if (typeof user_reg_info[email] == 'undefined') {
        upd_errors['incorrect_email'] = `${email} does not exist, Sign up! `;
    }
    // input pattern attributes for email validation from https://www.w3schools.com/TAGS/att_input_pattern.asp
    if (email.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/) == false) {
        upd_errors[`email`] = `Email can only consist of letters and numbers. `;
    }
    //validate email value
    //Email length must be minimum 4 characters and maximum 30 characters
    if (email.length < 4 || email.length > 30) {
        upd_errors[`email`] = `Email must be between 4 and 20 characters. `;
    } else if (email.length == 0) {
        upd_errors[`email`] = `Enter a email. `;
    }

    //validate password value
    //password must be at least 6 characters minimum
    if (password == 'undefined') {
        upd_errors[`password`] = `Enter a password. `;
    } else if (password.length < 8) {
        upd_errors[`password`] = `Password is too short. `;
    }

    //confirm password
    if (confirm_password == 'undefined') {
        upd_errors[`passwordReenter`] = `Re-enter your password. `;
    } else if (password == confirm_password) {
        console.log('passwords match');
    } else {
        upd_errors[`passwordReenter`] = `Passwords do not match, please try again. `;
    }

    //validate email value
    if (email == 'undefined') {
        upd_errors[`email`] = `Enter your email. `;
    }
    //validate name value
    //name cannot be more than 30 characters
    if (name == 'undefined') {
        upd_errors[`name`] = `Enter your full name. `;
    }

    else if (name.length > 30) {
        upd_errors[`name`] = `Name cannot be more than 30 characters. `;
    }

    let params = (new URLSearchParams());
    //if there's no errors, and the email does exist add updated info to user_data.json, log in user, and redirect to invoice
    if (Object.keys(upd_errors).length == 0 && typeof user_reg_info[email] != 'undefined') {
        user_reg_info[email] = {};
        user_reg_info[email].name = request.body.name;
        user_reg_info[email].password = request.body.password;
        fs.writeFileSync(filename, JSON.stringify(user_reg_info), "utf-8");
        user_logged_in == true;
        params.append('quantities', request.body.quantities)
        params.append('email', request.body.email)
        response.redirect(`./Invoice.html?` + params.toString());
    } else {
        //generate update error message
        let upd_error_string = '';
        for (err in upd_errors) {
            upd_error_string += upd_errors[err];
        }
        //response.send(upd_error_string);
        response.redirect('./update_info.html?' + `&upd_error_string=${upd_error_string}` + params.toString());
        console.log(`upd_error_string=${upd_error_string} `);
    }
});

//If returnErrors is true, array of errors is returned
//others return true if q is a non-neg int.
function isNonNegInt(q, returnErrors = false) {
    errors = []; // assume no errors at first
    if (q == '') q = 0;
    if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    else {
        if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
        if (parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
    }
    return returnErrors ? errors : (errors.length == 0);
};


//-----------------------------------------------------------------------------//
// Sessions 
//-----------------------------------------------------------------------------//
app.get("/logout", function (request, response, next) {
    //destroy the session when the user logs out
    request.session.destroy();
    //redirect to the index.html page when user logs out
    response.redirect('./index.html');
});
//request to clear session will be called when the final checkout page is loaded
app.get("/clear_session.js", function (request, response, next) {
    //destroy the session when the final checkout confirmation page loads
    request.session.destroy();
    next();
});

//-----------------------------------------------------------------------------//
// Mailer - referenced from Brandon Jude (Fall 2021)
//-----------------------------------------------------------------------------//
app.get("/checkout", function (request, response) {
    var email = request.query.email; // email address in querystring
    // Generate HTML invoice string
    var invoice_str = `Thank you for your order ${email}!<table border><th>Quantity</th><th>Item</th>`;
    var shopping_cart = request.session.cart;
    for (product_key in products_data) {
        for (i = 0; i < products_data[product_key].length; i++) {
            if (typeof shopping_cart[product_key] == 'undefined') continue;
            qty = shopping_cart[product_key][i];
            if (qty > 0) {
                invoice_str += `<tr><td>${qty}</td><td>${products_data[product_key][i].name}</td><tr>`;
            }
        }
    }
    invoice_str += '</table>';
    // Set up mail server. Only will work on UH Network due to security restrictions
    var transporter = nodemailer.createTransport({
        host: "mail.hawaii.edu",
        port: 25,
        secure: false, // use TLS
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
        }
    });

    var mailOptions = {
        from: 'adidas_store.com',
        to: email,
        subject: 'This is your invoice',
        html: invoice_str
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            invoice_str += '<br>There was an error and your invoice could not be emailed :(';
        } else {
            invoice_str += `<br>Your invoice was mailed to ${email}`;
        }
        response.send(invoice_str);
    });

});

// When user clicks done button on final page, they will be redirected to the index page
app.post("/done", function (request, response, next) {
    response.redirect(`./`);
    next();
});

//-----------------------------------------------------------------------------//
// Enables routing and GET request to files in the public directory  
app.use(express.static('./public'));
// Starts the server on port 8080
app.listen(8080, () => console.log(`listening on port 8080`));