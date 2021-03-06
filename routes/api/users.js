const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

//load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

//load user model
const User = require('../../models/User');

// @route GET api/users/test
// @desc  Tests users route
// @access Public
router.get('/test', (req,res)=> res.json({msg:'Users work'}));

// @route POST api/users/register
// @desc  Register new user
// @access Public
router.post('/register', (req,res)=> {
    const {errors, isValid} = validateRegisterInput(req.body);

    // check validation
    if(!isValid){
        return res.status(400).json(errors);
    }

    User.findOne({email: req.body.email})
        .then(user=>{
            if(user){
                errors.email = 'Email already exits';
                return res.status(400).json(errors);
            }
            else{
                const avatar = gravatar.url(req.body.email, {
                    s:'200', //size
                    r: 'pg', //rating
                    d: 'mm'  //default 
                });

                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password
                });

                //for encryption new user password
                bcrypt.genSalt(10, (err, salt)=>{
                    bcrypt.hash(newUser.password, salt, (err, hash)=>{
                        if(err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user=> res.json(user)) //respond on user
                            .catch(err=> console.log(err)); //check error
                    })
                })
            }
        })
});

// @route  POST api/users/login
// @desc   Login User / Returning JWT Token
// @access Public

router.post('/login', (req,res)=>{

    const {errors, isValid} = validateLoginInput(req.body);

    const email = req.body.email;
    const password = req.body.password;
    // check for user
    User.findOne({email})
        .then(user=> {
            if(!user){
                errors.email = 'user not found';
                return res.status(404).json(errors);     
            }

            // check password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(isMatch){  //user matched
                        const payload = { id: user.id, name:user.name, avatar: user.avatar }; //create jwt payload
                        //sign token
                        jwt.sign(
                            payload, 
                            keys.secretOrKey, 
                            { expiresIn: 3600 }, 
                            (err, token) => {
                                res.json({
                                    success: true,
                                    token: 'Bearer' + token
                                });
                        });
                    } else{
                        errors.password = 'Password incorrect';
                        return res.status(400).json(errors);
                    }
                });
        });
});

// @route  GET api/users/current
// @desc   Return current user
// @access Private

router.get(
    '/current', 
    passport.authenticate('jwt', {session: false}), 
    (req, res)=>{
        res.json({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email
            //msg: 'Success'
        });
    }
);

module.exports = router;