var express = require('express');
var app = express();
app.use(express.urlencoded({ extended: true }));

// app.all means that the route will go to all paths/requests
// respond to any req for any path
app.all('*', function (request, response, next) {
    
    console.log(request.method + ' to path ' + request.path + 'with query' + JSON.stringify(request.query));
    next();
});
// Ex4a
var products = require(__dirname + '/product_data.json');

app.get("/product_data.js", function (request, response, next) {
   response.type('.js');
   var products_str = `var products = ${JSON.stringify(products)};`;
   response.send(products_str);
});


app.get('/test.html', function (request, response, next) {
    response.send('in test: ' + request.method + ' to path ' + request.path);
});
// Ex2d
// Change app.get to app.post
app.post('/process_form', function (request, response, next) {
    // response.send(request.body); Delete
    var q = request.body['qty_textbox1'];
        if (typeof q != 'undefined') {
        response.send(`Thank you for purchasing ${q} things!`);
        }else{
            response.send('Error: ${q} is not a quantity. Hit the back button to fix..');
            
    } 

});
app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`)); // note the use of an anonymous function here

//3c.
function isNonNegInt(q, returnErrors=false) {
    errors = []; 
        if(Number(q) != q) errors.push('Not a number!'); 
            else {
                if(q < 0) errors.push('Negative value!'); 
                    if(parseInt(q) != q) errors.push('Not an integer!'); 
    }   

        return (returnErrors ? errors : (errors.length == 0));
    }