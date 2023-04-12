// Adapted from Professor Kazman's MySQL-Server.js

var express = require('express');
var app = express();
var myParser = require("body-parser");
var mysql = require('mysql');

console.log("Connecting to localhost..."); 
var con = mysql.createConnection({
  host: '127.0.0.1',
  user: "root",
  port: 8080,
  database: "Ooohmami",
  password: ""
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

app.use(express.static('./public'));
app.use(myParser.urlencoded({ extended: true }));

function isNonNegInt(stringToCheck, returnErrors = false) {
  errors = []; // assume no errors at first
  if (Number(stringToCheck) != stringToCheck) errors.push('Not a number!'); // Check if string is a number value
  if (stringToCheck < 0) errors.push('Negative value!'); // Check if it is non-negative
  if (parseInt(stringToCheck) != stringToCheck) errors.push('Not an integer!'); // Check that it is an integer

  return returnErrors ? errors : (errors.length == 0);
}

function query_DB(POST, response) {
    if (isNonNegInt(POST['quantity'])) {   // Only process the form if we have a quantity
      quantity = POST['quantity'];      // Grab the quantity from the submitted form
      jerky_type = POST['jerky_type'];  // Grab the jerky type from the submitted form
      query = "INSERT INTO Orders (quantity, product) VALUES (" + quantity + ", '" + jerky_type + " Beef Jerky')";  // Build the query string
      con.query(query, function (err, result, fields) {   // Run the query
        if (err) throw err;
        console.log(result);
      var res_string = JSON.stringify(result);
      var res_json = JSON.parse(res_string);
      console.log(res_json);

      // Now build the response: table of results and form to do another query
      response_form = `<form action="Room-query.html" method="GET">`;
      response_form += `<table border="3" cellpadding="5" cellspacing="5">`;
      response_form += `<td><B>Room#</td><td><B>Hotel#</td><td><B>Type</td><td><B>Price</td></b>`;
      for (i in res_json) {
        response_form = `<form action="jerky-order.html" method="GET">`;
        response_form += `<p>Thank you for your order of ${quantity} packs of ${jerky_type} beef jerky!</p>`;
        response_form += `<input type="submit" value="Place Another Order"> </form>`;
      }
      response_form += "</table>";
      response_form += `<input type="submit" value="Another Order?"> </form>`;
      response.send(response_form);
    });
  } else {
    response.send("Enter a quantity for your order!");
  }
}

// Homepage route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
  });

// Respond to all requests

app.all('*', function (request, response, next) {
  console.log(request.method + ' to ' + request.path);
  next();
});

app.post("/process_query", function (request, response) {
  let POST = request.body;
  query_DB(POST, response);
});

app.listen(8080, () => console.log(`listening on port 8080`));