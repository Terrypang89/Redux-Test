var JwtStrategy = require('passport-jwt').Strategy;
//type of passport strategies can select from here: http://www.passportjs.org/packages/ 
const ExtractJwt = require('passport-jwt').ExtractJwt; //get a passport jwt 
const mongoose = require('mongoose');
const User = mongoose.model('users'); // connect with user
const keys = require('../config/keys');

//configure for passport strategies using passport-jwt
var opts = {}; 
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); //get token 
opts.secretOrKey = keys.secretOrKey; //get the secret key

module.exports = passport =>{
    passport.use( //create a new strategy for the jwt with option then pass jwt_payload callback function with done 
        new JwtStrategy(opts, (jwt_payload, done)=>{ 
            //console.log(jwt_payload);
            User.findById(jwt_payload.id) //find the payload using id
                .then(user=>{ 
                    if(user){ 
                        // When Passport authenticates a request, 
                        // it parses the credentials contained in the request. 
                        // It then invokes the verify callback with those credentials as arguments, 
                        // in this case username and password. If the credentials are valid, 
                        // the verify callback invokes done to supply Passport with the user that authenticated.
                        return done(null, user); 
                    }
                    // If the credentials are not valid (for example, if the password is incorrect), 
                    // done should be invoked with false instead of a user to indicate an authentication failure.
                    return done(null, false); 
                })
                .catch(err=>console.log(err)); //return error if error found
    }));
};
