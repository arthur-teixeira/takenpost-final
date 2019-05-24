const mongoose = require("mongoose")

//carrega modelo do usuário
require("../models/User");
const User = mongoose.model("users")
//carrega modelo dos posts
require("../models/Post")
const Post = mongoose.model("posts")


module.exports = {
   getAdd: (req, res, next) => {
      res.render("user/add")
   },
   postAdd: (req, res, next) => {
      let allowComments;
      req.body.allowComments ?
         allowComments = true :
         allowComments = false

      const newPost = {
         image: req.body.image,
         caption: req.body.legenda,
         allowComments,
         user: req.user.id
      }

      new Post(newPost).save()
         .then(post => {
            res.redirect(`/user/show/${post.id}`)
         })
         .catch(err => {
            let error = err;
            error.httpStatusCode = 500;
            next(error)
         })
   },
   showPosts: (req, res, next) => {
      let postid = req.params.id;
      Post.findOne({
            _id: postid
         })
         .populate('user')
         .then(post => {
            res.render("user/show", {
               post
            })
         })
         .catch(err => {
            let error = err;
            error.httpStatusCode = 500;
            next(error)
         })
   },
   postComment: (req, res, next) => {
      Post.findOne({
            _id: req.params.id
         })
         .then(post => {
            let newComment = {
               commentBody: req.body.commentBody,
               commentUser: req.user.name
            }
            post.comments.unshift(newComment)
            post.save()
               .then(post => {
                  res.redirect(`/user/show/${post.id}`)
               })
         })
         .catch(err => {
            let error = err;
            error.httpStatusCode = 500;
            next(error)
         })
   },
   deletePost: (req, res, next) =>{
      Post.deleteOne({_id: req.params.id})
         .then(result =>{
            req.flash("success_msg", "Post deletado")
            res.redirect("/user/dashboard")
         })
         .catch(err => {
            let error = err;
            error.httpStatusCode = 500;
            next(error)
         })
   }
}