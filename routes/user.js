const express = require("express")
const router = express.Router();
const mongoose = require("mongoose")
const {
   ensureAuth,
   ensureGuest
} = require("../helpers/auth")

//controllers
const UserController = require("../controllers/UserController")
const AuthController = require("../controllers/AuthController")
const PostsController = require("../controllers/PostsController")

//carrega modelo dos posts
require("../models/Post")
const Post = mongoose.model("posts")

//Perfil do Usuário
router.get("/profile/:id", ensureAuth, UserController.getUserProfile)

//login
router.route('/login')
   .get(AuthController.getLogin)
   .post(ensureGuest, AuthController.postLogin)

//feed
router.get('/feed', ensureAuth, UserController.getFeed)

//registrar usuário
router.route('/register')
   .get(ensureGuest, AuthController.getRegisterForm)
   .post(ensureGuest, AuthController.postRegister)

router.get('/logout', ensureAuth, AuthController.logout)

router.route('/add')
   .get(ensureAuth, PostsController.getAdd)
   //adiciona post
   .post(ensureAuth, PostsController.postAdd)

//mostra posts
router.get('/show/:id', PostsController.showPosts)

//comentar
router.post('/comment/:id', PostsController.postComment);

//dashboard
router.get('/dashboard', ensureAuth, UserController.getDashboard)

//editar e deletar
router.delete('/delete/:id',ensureAuth, PostsController.deletePost)
   

module.exports = router