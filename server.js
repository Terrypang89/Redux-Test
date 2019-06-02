const express = require('express');
const mongoose = require('mongoose'); //from mongoose js
const bodyParser = require('body-parser'); //use for express
const passport = require('passport');
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');
const app= express();

//body-parser extract the entire body portion of an incoming request stream and exposes it on req.body

//body-parser module parses the JSON, buffer, string and URL encoded data submitted using HTTP POST request

// app.use() to specify middleware as the callback function (See Using middleware for details)
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//config db
const db = require('./config/keys').mongoURI;

//config mongoose for 
mongoose
    .connect(db)
    .then(()=>console.log('MongoDB connected'))
    .catch(err => console.log(err));

// app.get('/',(req, res)=> res.send('Hello'));

// passport middleware initialized for express
app.use(passport.initialize());

// passport config to detect user id
require('./config/passport')(passport);

// use routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 5000; //set server posrt, 

app.listen(port, () => console.log('Server running on port ${port}'));


