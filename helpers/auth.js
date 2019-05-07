module.exports = {
   ensureAuth = (req,res,next) =>{
      if(req.isAuthenticated()){
         return next();
      }
      req.flash('error-msg', 'Sem autorização')
      res.redirect('/user/login')
   },
   ensureGuest = (req,res,next) =>{
      if(!req.isAuthenticated()){
         return next();
      }
      res.redirect("/users/feed")
   }
}