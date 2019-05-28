const mongoose = require("mongoose")
const path = require("path");
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
      if (!req.files) {
         req.flash("error_msg", "nenhum arquivo anexado")
         return res.redirect('/user/add')
      }
      const image = req.files.image
      const extension = path.extname(image.name)
      const mimetype = image.mimetype
      console.log(mimetype)
      if (mimetype != 'image/jpg' && mimetype != 'image/jpeg' && mimetype != 'image/png') {
         req.flash("error_msg", "O arquivo enviado não é uma imagem")
         return res.redirect('/user/add')
      }
      const imgPath = `/${Date.now().toString()}-${image.md5}${extension}`
      image.mv(`./images${imgPath}`)
      let allowComments;
      req.body.allowComments ? allowComments = true : allowComments = false
      const newPost = new Post({
         imgPath,
         caption: req.body.legenda,
         allowComments,
         user: req.user._id
      })
      newPost.save() //salva no DB
         .then(post => {
            res.redirect(`/user/show/${post._id}`) //redireciona
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
            next(err)
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
            next(err)
         })
   },
   deletePost: (req, res, next) => {
      Post.deleteOne({
            _id: req.params.id
         })
         .then(result => {
            req.flash("success_msg", "Post deletado")
            res.redirect("/user/dashboard")
         })
         .catch(err => {
            next(err)
         })
   }
}