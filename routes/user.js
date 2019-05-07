const express = require("express")
const router = express.Router();
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const passport = require("passport")
const {ensureAuth, ensureGuest} = require("../helpers/auth")

//carrega modelo do usuário
require("../models/User");
const User = mongoose.model("users")

//Perfil do Usuário
router.get("/profile", ensureAuth, (req, res) => {
   res.render("user/profile", {
      source: '/img/pfp2.jpg'
   });
})

router.route('/login')
   //form login
   .get(ensureGuest, (req, res) => {
      res.render("user/login")
   })
   .post(ensureGuest, (req, res, next) => {
      passport.authenticate('local', {
         successRedirect: '/user/feed',
         failureRedirect: '/user/login',
         failureFlash: true
      })(req, res, next)
   })

//feed
router.get('/feed', ensureAuth, (req, res) => {
   res.render("user/feed")
})

//registrar usuário
router.route('/register')
   .get(ensureGuest, (req, res) => {
      res.render("user/register")
   })
   .post(ensureGuest, (req, res) => {
      let errors = [];

      if (req.body.password != req.body.password2) {
         errors.push({
            text: 'As senhas não são iguais'
         })
      }

      if (req.body.password.length < 6) {
         errors.push({
            text: 'A senha precisa ter no mínimo 6 caracteres'
         })
      }

      if (errors.length > 0) {
         res.render("user/register", {
            errors,
            name: req.body.name,
            lastName: req.body.lastName,
            email: req.body.email
         });
      } else {
         User.findOne({
               email: req.body.email
            })
            .then(user => {
               if (user) {
                  req.flash("error_msg", "Este email já está cadastrado")
                  res.redirect('/user/register')
               } else {
                  const newUser = new User({
                     name: req.body.name,
                     lastName: req.body.lastName,
                     email: req.body.email,
                     password: req.body.password,
                     pfp: req.body.avatar
                  });

                  bcrypt.genSalt(10, (err, salt) => {
                     bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                           .then(user => {
                              req.flash("success_msg", "Você foi registrado e pode se logar")
                              res.redirect("/user/login")
                           })
                           .catch(err => {
                              console.log(err);
                              return;
                           })
                     })
                  })
               }
            })
      }
   })

router.get('/logout', ensureAuth, (req, res) => {
   req.logout();
   req.flash("success_msg", "Você saiu")
   res.redirect('/user/login')
})

module.exports = router