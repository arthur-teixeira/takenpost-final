const passport = require("passport")

module.exports = {
    getLogin: (req, res) => {
        res.render("user/login")
    },
    postLogin: (req, res, next) => {
        passport.authenticate('local', {
            successRedirect: '/user/feed',
            failureRedirect: '/user/login',
            failureFlash: true
        })(req, res, next)
    },
    getRegisterForm: (req, res) => {
        res.render("user/register")
    },
    logout:(req, res) => {
        req.logout();
        req.flash("success_msg", "Você saiu")
        res.redirect('/user/login')
     },
     
    postRegister: (req, res) => {
        let errors = [];

        if (req.body.password != req.body.password2) {
            errors.push({ text: 'As senhas não são iguais' })
        }

        if (req.body.password.length < 6) {
            errors.push({ text: 'A senha precisa ter no mínimo 6 caracteres' })
        }

        if (errors.length > 0) {
            res.render("user/register", {
                errors,
                name: req.body.name,
                lastName: req.body.lastName,
                email: req.body.email
            });
        } else {
            User.findOne({ email: req.body.email })
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
                                    .then(() => {
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
    }
}