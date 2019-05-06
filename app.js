const express = require("express");
const exphbs = require("express-handlebars")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const flash = require("connect-flash");
const session = require("express-session")
const passport = require("passport");
const app = express()

// Passport Config
require('./config/passport')(passport);

//middleware Express session 
app.use(session({
   secret: 'secret',
   resave: true,
   saveUninitialized: true
 }));
app.use(flash());

//carregar rotas
const indexRoute = require("./routes/index")
const userRoute = require("./routes/user")

//middleware handlebars
app.engine('handlebars', exphbs({
   defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//middleware body parser
app.use(bodyParser.urlencoded({
   extended: false
}));
app.use(bodyParser.json());

//conectar ao banco
mongoose.connect('mongodb://localhost/takenpost-dev', {
      useNewUrlParser: true
   })
   .then(() => console.log("Conectado ao banco"))
   .catch(err => console.log(err))


//variáveis globais
app.use(function (req, res, next) {
   res.locals.success_msg = req.flash('success_msg');
   res.locals.error_msg = req.flash('error_msg');
   res.locals.error = req.flash('error');
   res.locals.user = req.user || null;
   next();
});


 
 //middleware Passport
 app.use(passport.initialize());
 app.use(passport.session());
 


//definicao de rotas
app.use('/', indexRoute)
app.use('/user', userRoute)



const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Servidor escutando na porta ${port}`))