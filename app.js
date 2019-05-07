const express = require("express");
const exphbs = require("express-handlebars")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const flash = require("connect-flash");
const session = require("express-session")
const path = require("path");
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



//pasta estática
app.use(express.static(path.join(__dirname, 'public')));

//carregar rotas
const userRoute = require("./routes/user")

//conectar ao banco
mongoose.connect('mongodb://localhost/takenpost-dev', {
      useNewUrlParser: true
   })
   .then(() => console.log("Conectado ao banco"))
   .catch(err => console.log(err))
   
 //middleware Passport
 app.use(passport.initialize());
 app.use(passport.session());
 
//variáveis globais
app.use(function(req, res, next){
   res.locals.success_msg = req.flash('success_msg');
   res.locals.error_msg = req.flash('error_msg');
   res.locals.error = req.flash('error');
   res.locals.user = req.user;
   next();
 });

//root
app.get('/',(req,res) =>{
   (req.isAuthenticated()) 
   ? res.redirect("/user/feed") 
   : res.redirect("/user/login")
})


//definicao de rotas
app.use('/user', userRoute)



const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Servidor escutando na porta ${port}`))