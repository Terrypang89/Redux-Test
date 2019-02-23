const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// load validation
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

// load profile model
var Profile = require('../../models/Profile');

// load user model
const User = require('../../models/User');

// @route   GET api/profile/test
// @descp   test profile route
// @access  Public
router.get('/test', (req,res)=> res.json({msg:'profile work'}));

// @route   GET api/profile
// @descp   GET current user profile
// @access  Private

router.get('/', passport.authenticate(
    'jwt', 
    {session: false}), 
    (req, res) => { //callback funct
    
        const errors = {};

    Profile.findOne({user: req.user.id})
        .then(profile => { //callback funct
            if(!profile){ // if no profile exists
                errors.noprofile= 'There is no profile for this user';
                return res.status(404).json(errors);
            }
            res.json(profile); //success response profile
        })
        .catch(err => res.status(404).json(err));
});



// @route   GET api/profile/all
// @descp   GET all profiles
// @access  Public

router.get('/all', (req, res)=> {
    const errors = {};

    Profile.find()
        .populate('user', ['name', 'avatar'])
        .then(profiles => {
            if(!profiles){
                errors.noprofile = 'There are no profile';
                res.status(404).json(errors);
            }
            res.json(profiles);
        })
        .catch(err => res.status(404).json({profiles: 'There is no profile'})); 
});

// @route   GET api/profile/handle/:handle
// @descp   GET profile by handle
// @access  Public

router.get('/handle/:handle', (req, res)=> {
    Profile.findOne({handle: req.params.handle})
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile){
                errors.noprofile = 'There is no profile for this user';
                res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err)); 
});

// @route   GET api/profile/user/:user_id
// @descp   GET profile by handle
// @access  Public

router.get('/user/:user_id', (req, res)=> {
    Profile.findOne({handle: req.params.user_id})
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile){
                errors.noprofile = 'There is no profile for this user';
                res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json({profile: 'There is no profile for this user'})); 
});

// @route   POST api/profile
// @descp   create user profile
// @access  Private

router.post('/', passport.authenticate(
    'jwt', 
    {session: false}), 
    (req, res) => { //callback funct

    const {errors, isValid} = validateProfileInput(res.body);

    // get validation
    if(!isValid)
    {
        // return any error with 400 status
        return res.status(400).json(errors);
    }

    // GET fields
    const profileFields = {};
    profileFields.user = req.user.id;
    
    if(req.body.handle) profileFields.handle = req.body.handle;
    if(req.body.company) profileFields.company = req.body.company;
    if(req.body.website) profileFields.website = req.body.website;
    if(req.body.location) profileFields.location = req.body.location;
    if(req.body.bio) profileFields.bio = req.body.bio;
    if(req.body.status) profileFields.status = req.body.status;
    if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;

    if(typeof req.body.skills !== 'undefined'){
        profileFields.skills = req.body,skills.split(',');
    }

    profileFields.social = {};
    if(req.body.youtube) profileFields.youtube = req.body.youtube;
    if(req.body.twitter) profileFields.twitter = req.body.twitter;
    if(req.body.facebook) profileFields.facebook = req.body.facebook;
    if(req.body.linkedin) profileFields.linkedin = req.body.linkedin;
    if(req.body.instagram) profileFields.instagram = req.body.instagram;

    Profile.findOne({user: req.user.id})
            .then(profile => {
                if(profile) { // update
                    Profile.findOneAndUpdate(
                        { user: req.user.id },
                        { $set: profileFields },
                        { new: true}
                    ).then(profile => res.json(profile));
                } else {
                    // create 

                    // check if handle exist
                    Profile.findOne({ handle: profileFields.handle}).then(profile =>{
                        if(profile){
                            errors.handle = 'handle already exists';
                            res.status(400).json(errors);
                        }

                        new Profile(profileFields).save().then(profile => res.json(profile));
                    })
                }
            })
});


// @route   POST api/profile/experience
// @descp   add experience to user profile
// @access  Private

router.post('/experience', passport.authenticate('jwt', {session: false}), ()=>{

    const {errors, isValid} = validateExperienceInput(res.body);

    // get validation
    if(!isValid)
    {
        // return any error with 400 status
        return res.status(400).json(errors);
    }

    Profile.findOne({user: req.user.id})
        .then(profile =>{
            const newExp = {
                title: req.body.title,
                company: req.body.company,
                location: req.body.location,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            }
            // add to exp array
            profile.experience.unshift(newExp);

            profile.save().then(profile=> res.json(profile));
        })
});



// @route   POST api/profile/education
// @descp   add education to user profile
// @access  Private

router.post('/education', passport.authenticate('jwt', {session: false}), ()=>{

    const {errors, isValid} = validateEducationInput(res.body);
    // get validation
    if(!isValid)
    {
        // return any error with 400 status
        return res.status(400).json(errors);
    }

    Profile.findOne({user: req.user.id})
        .then(profile =>{
            const newEdu = {
                school: req.body.school,
                degree: req.body.degree,
                fieldofstudy: req.body.fieldofstudy,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            }
            // add to exp array
            profile.education.unshift(newEdu);

            profile.save().then(profile=> res.json(profile));
        })
});


// @route   DELETE api/profile/experience/:exp_id
// @descp   delete exp to user profile
// @access  Private

router.delete('/experience/:exp_id', passport.authenticate('jwt', {session: false}), (req, res)=>{

    Profile.findOne({user: req.user.id})
        .then(profile =>{
            const removeIndex = profile.experience
                .map(item => item.id)
                .indexOf(req.params.exp_id);

            //splice out of array
            profile.experience.splice(removeIndex, 1);
            //save
            profile.save().then(profile => res.json(profile));
        })
        .catch(err => res.status(404).json(err));
});



// @route   DELETE api/profile/education/:edu_id
// @descp   delete edu to user profile
// @access  Private

router.delete('/education/:exp_id', passport.authenticate('jwt', {session: false}), (req, res)=>{

    Profile.findOne({user: req.user.id})
        .then(profile =>{
            const removeIndex = profile.education
                .map(item => item.id)
                .indexOf(req.params.edu_id);

            //splice out of array
            profile.education.splice(removeIndex, 1);
            //save
            profile.save().then(profile => res.json(profile));
        })
        .catch(err => res.status(404).json(err));
});


// @route   DELETE api/profiles
// @descp   delete user and profile
// @access  Private

router.delete('/', passport.authenticate('jwt', {session: false}), (req, res)=>{
    Profile.findOneAndRemove({user: req.user.id})
        .then(()=> {
            User.findOneAndRemove({ _id: req.user.id}).then(()=>{
                res.json({ success: true})
            });
        });
});


module.exports = router;