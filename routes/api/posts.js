const express = require('express');
const router = express.Router();
// Routing refers to how an application’s endpoints (URIs) respond to client requests.
const mongoose = require('mongoose');
const passport = require('passport');
// Passport Strategies require what is known as a verify callback. 
// The purpose of a verify callback is to find the user that possesses a set of credentials
// this is mostly use when http post for request for posting do something

// profile model
const Profile = require('../../models/Profile');

// post model
const Post = require('../../models/Post');

// validation
const validatePostInput = require('../../validation/post');

// @route   GET /api/posts/test
// @desc    Test post require
// @access  public

router.get('/test', (req,res)=> res.json({msg:'posts work'}));

// @route   GET /api/posts
// @desc    Get post
// @access  public

router.get('/', (req,res)=> {
    Post.find()
        .then(post => res.json(posts))
        .catch(err=> res.status(404).json({nopostfound: 'No post found'}));
    }
);

// @route   POST /api/posts/:id
// @desc    Create post by id
// @access  public

router.get('/:id', (req,res)=> {
    Post.findById(req.paramms.id)
        .then(post => res.json(posts))
        .catch(err=> res.status(404).json({nopostfound: 'No post found with that ID'}));
    }
);

// passport.auth is required during post 
router.post('/', passport.authenticate('jwt', {session: false}), (req, res)=>{
    const {errors, isValid} = validatePostInput(req.body);

    // check validation
    if(!isValid){
        //if any errors, send 400 with errors object
        return res.status(400).json(errors);
    }

    const newPost = new Post({
        text: req.body,text,
        name: req.body.name,
        avatar: req.body.name,
        user: req.user.id
    });
    newPost.save().then(post => res.json(post));
});

// @route   DELETE /api/posts/:id
// @desc    Delete post
// @access  private
 
router.delete('/:id', passport.authenticate('jwt', {session: false}), (req, res)=>{
    Profile.findOne({ user: req.user.id})
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    //check for post owner
                    if(post.user.toString() !== req.user.id){
                        return res.status(401).json({notauthorized: 'User not authorized'});
                    }

                    //Delete
                    post.remove().then(()=> res.json({success: true}));
                })
                .catch(err => res.status(404).json({postnotfound: 'No post found'}));
        })
});


// @route   POST /api/posts/link/:id
// @desc    like post
// @access  private

router.post('/like/:id', passport.authenticate('jwt', {session: false}), (req, res)=>{
    Profile.findOne({ user: req.user.id})
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if(post.likes.fileter(like=> like.user.toString() === releaseEvents.user.id).length > 0) {
                        return res.status(400).json({alreadyliked: 'User already liked this post'});
                    }

                    //add user id to likes array
                    post.likes.unshift({ user: req.user.id});

                    post.save().then(post => res.json(post));
                })
                .catch(err => res.status(404).json({postnotfound: 'No post found'}));
        })
});


// @route   POST /api/posts/unlike/:id
// @desc    unlike post
// @access  private

router.post('/unlike/:id', passport.authenticate('jwt', {session: false}), (req, res)=>{
    Profile.findOne({ user: req.user.id})
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => { //check of user already there
                    if(post.likes.fileter(like=> like.user.toString() === releaseEvents.user.id).length === 0) {
                        return res.status(400).json({notliked: 'you have not yet like this post'});
                    }

                    //add user id to likes array
                    const removeIndex = post.likes
                                            .map(item => item.user.toString())
                                            .indexOf(req.user.id);
                    // splice out of array
                    post.likes.splice(removeIndex, 1);

                    //save
                    post.save().then(post => res.json(post));
                })
                .catch(err => res.status(404).json({postnotfound: 'No post found'}));
        })
});


// @route   POST /api/posts/comment/:id
// @desc    Add comment to post
// @access  private

router.post('/comment/:id', passport.authenticate('jwt', {session: false}), (req,res) => {
    const {errors, isValid} = validatePostInput(req.body);

    // chekc validation
    if(!isValid){
        //if any errors, send 400 with errors object
        return res.status(400).json(errors);
    } 


    Post.findById(req.params.id)
        .then(post => {
            const newComment ={
                text: req.body.text,
                name: req.body.name,
                avatar: req.body.avatar,
                user: req.user.id
            }

            //Add to comments array
            post.comments.unshift(newComment);

            //save
            post.save().then(post=>res.json(post));
        })
        .catch(errors => res.status(404).json({postnotfound: 'No post found'}));
});


// @route   DELETE /api/posts/comment/:id/:comment_id
// @desc    Remove comment from post
// @access  private

router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', {session: false}), (req,res) => {
    Post.findById(req.params.id)
        .then(post => {
            //check to see if comment exists
            if(post.comments.fileter(comment => comment._id.toString() === req.params.comment_id).length === 0){
                return res.status(404).json({ commentnotexists: 'Comment does not exist'});
            }

            // get remove index
            const removeIndex = post.comments   
                .map(item => item._id.toString())
                .indexOf(req.params.comment_id);

                //splice comment out of array
                post.comments.splice(removeIndex, 1);

                post.save().then(post => res.json(post));

        })
        .catch(errors => res.status(404).json({postnotfound: 'No post found'}));
});


module.exports = router;