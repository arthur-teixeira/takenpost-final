const mongoose = require("mongoose")

//carrega modelo do usuário
require("../models/User");
const User = mongoose.model("users")
//carrega modelo dos posts
require("../models/Post")
const Post = mongoose.model("posts")

module.exports = {
    getUserProfile: (req, res) => {
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
           .catch(err => console.log(err))
     },
     getFeed:(req, res) => {
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
     }
}