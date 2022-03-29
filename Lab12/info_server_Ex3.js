var express = require('express');
var app = express();
app.use(express.urlencoded({ extended: true }));

// app.all means that the route will go to all paths/requests
// respond to any req for any path
app.all('*', function (request, response, next) {
    console.log(request.method + ' to path ' + request.path + 'with query' + JSON.stringify(request.query));
    next();
});

app.get('/test.html', function (request, response, next) {
    response.send('in test: ' + request.method + ' to path ' + request.path);
});
// Ex2d
// Change app.get to app.post
app.post('/process_form', function (request, response, next) {
    // response.send(request.body); Delete
    var q = request.body['quantity_textbox'];
        if (typeof q != 'undefined') {
        response.send(`Thank you for purchasing ${q} things!`);
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