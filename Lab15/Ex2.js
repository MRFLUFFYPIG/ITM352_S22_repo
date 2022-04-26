var express = require('express');
var app = express();
const fs = require('fs');

var filename = "./user_data.json";

if (fs.existsSync(filename)) {
    let stats = fs.statSync(filename);
    console.log(`${filename} has ${stats.size} characters`)
    var data = fs.readFileSync(filename, 'utf-8');
    var users = JSON.parse(data);
    if (typeof users["kazman"] != 'undefined') {
        console.log(users["kazman"].password);
    }
} else {
    console.log(`${filename} doesn't exist :(`);
}

app.use(express.urlencoded({ extended: true }));


var cookieParser = require('cookie-parser');
app.use(cookieParser());

var session = require('express-session');

app.use(session({ secret: "MySecretKey", resave: true, saveUninitialized: true }));

// Login Routing 
app.get("/login", function(request, response) {
    // Checks the users last login
    var last_login = 'first visit!';
    if (typeof request.session.last_login != 'undefined') {
        last_login = request.session.last_login;
    }
    // Give a simple login form
    if(typeof request.cookies.username != 'undefined') {
        wecome_msg = `Welcome ${request}`
    }
    // Login Page
    str = `
<body>
You last logged in on ${last_login}<br>
<form action="" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
    response.send(str);
});

app.post("/login", function(request, response) {
    console.log(request.body);
    // Process login form POST and redirect to logged in page if criteria is met 
    let login_username = request.body['username'];
    let login_password = request.body['password'];

    if (typeof users[login_username] != 'undefined') {
        // Checks for existing username and correct username
        if (users[login_username]['password'] == login_password) {
            request.session.last_login = new Date();
            response.send(`${login_username} is logged in`);
            return;
        } else {
            response.send(`Incorrect password for ${login_username}`)
        }
    } else {
        response.send(`${login_username} does not exist`);
    }
});

app.get("/register", function(request, response) {
    // Register Page
    str = `
<body>
<form action="" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="password" name="repeat_password" size="40" placeholder="enter password again"><br />
<input type="email" name="email" size="40" placeholder="enter email"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
    response.send(str);
});

app.post("/register", function(request, response) {
    // process a simple register form
    console.log(request.body);
    let username = request.body['username'];
    users['username'] = {}; //creates a new space in the user's object for the property username
    users['username']['password'] = request.body['password'];
    users['username']['email'] = request.body['email'];

    fs.writeFileSync(filename, JSON.stringify(user_data));
});

app.get("/set_cookie", function(request, response) {
    var name = "Nick Sebastian"
    response.cookie("users_name", name, { maxAge: 5 * 1000 }); //users_name is what the cookie is called and name is the value contained in the cookie 
    response.send(`cookie sent for ${name}`);
});

 // You can set a timer for the cookie to disapper on a timer or by the client to deleting it
 // Express cookie set expiration
 app.get("/expire_cookie", function (request, response) {
    var myname = "Nick Sebastian";
    response.cookie("users_name", myname, {expire: Date.now()});
    // response.cookie("users_name", myname, {maxAge: 5*1000});
    // Timer
    /*
    res.cookie(name, 'value', {expire: 360000 + Date.now()});
    res.cookie(name, 'value', {maxAge: 360000}); */
    response.send(`cookie sent for ${myname}`);
 });
 
app.get("/use_cookie", function(request, response) {
    console.log(request.cookies); //logs the information in the cookie into the server console
    response.send(`Welcome to the Use Cookie page ${request.cookies['users_name']}`);
});

// Keeps track of users session 
app.get("/use_session", function(request, response) {
    console.log(request.session);
    response.send(`Welcome, your session ID is ${request.session.id}`) // Keeps data in session 
});

app.listen(8080, () => console.log(`listening on port 8080`));