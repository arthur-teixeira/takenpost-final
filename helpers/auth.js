module.exports = {
   ensureAuth: (req,res,next) =>{
      if(req.isAuthenticated()){
         return next();
      }
      req.flash('error_msg', 'Sem autorização')
      res.redirect('/user/login')
   },
   ensureGuest: (req,res,next) =>{
      if(!req.isAuthenticated()){
         return next();
      }
      req.flash('error_msg', 'Você já possui uma conta')
      res.redirect("/user/feed")
   }
}