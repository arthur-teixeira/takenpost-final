const mongoose = require("mongoose")

//carrega modelo do usuário
require("../models/User");
const User = mongoose.model("users")
//carrega modelo dos posts
require("../models/Post")
const Post = mongoose.model("posts")

module.exports = {
    getUserProfile: (req, res,next) => {
        let userid = req.params.id;
        User.findById(userid)
           .then(user =>{
              if(user){
                 res.render("user/profile", {
                    profile: user
                 })
              } else {
                 req.flash("error_msg","este usuário não existe");
                 res.redirect("/user/login")
              }
           })
           .catch(err => {
            let error = err;
            error.httpStatusCode = 500;
            next(error)
         })
     },
     getFeed:(req, res,next) => {
        Post.find({})
           .populate('user')
           .sort({
              date: 'desc'
           })
           .then(posts =>{
              res.render("user/feed", {
                 posts:posts
              })
           })
           .catch(err => {
            let error = err;
            error.httpStatusCode = 500;
            next(error)
         })
     },
     getDashboard:(req,res,next) =>{
        Post.find({user: req.user._id})
         .then(posts =>{
            res.render('user/dashboard',{posts})
         })
         .catch(err => {
            let error = err;
            error.httpStatusCode = 500;
            next(error)
         })
     }
}