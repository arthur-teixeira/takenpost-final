const mongoose = require("mongoose")
const path = require("path");
const fs = require("fs")
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
      if (mimetype != 'image/jpg' && mimetype != 'image/jpeg' && mimetype != 'image/png') {
         req.flash("error_msg", "O arquivo enviado não é uma imagem")
         return res.redirect('/user/add')
      }
      const imgPath = `/${Date.now().toString()}-${image.md5}${extension}`
      image.mv(`./images${imgPath}`)
      const newPost = new Post({
         imgPath,
         caption: req.body.legenda,
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
            if (!req.body.commentBody) {
               req.flash("error_msg", "você nao escreveu um comentário")
               return res.redirect(`/user/show/${post.id}`)
            }
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
      Post.findById(req.params.id)
         .then(post => {
            fs.unlink(path.join(__dirname, '/..', 'images', post.imgPath), err => {
               if (err) return next(err)
            })
            Post.deleteOne({
               _id: req.params.id
            })
               .then(result => {
                  req.flash("success_msg", "Post deletado")
                  res.redirect("/user/dashboard")
               })
               .catch(err => { if (err) console.log(err) })
         })

   }
}