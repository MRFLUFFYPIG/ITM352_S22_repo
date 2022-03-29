var express = require('express');
var app = express();
// app.all means that the route will go to all paths/requests
// respond to any req for any path
app.all('*', function (request, response, next) {
    console.log(request.method + ' to path ' + request.path);
    next();
})

app.get('/test', function (request, response, next){
    response.send('in test: ' + request.method + ' to path ' + request.path);
});

// Ex2d
// Change app.get to app.post
app.post('/process_form', function (request, response, next){
    response.send('processing purchase');
});

app.use(express.static(__dirname + '/public'));;
app.listen(8080, () => console.log(`listening on port 8080`)); // note the use of an anonymous function here