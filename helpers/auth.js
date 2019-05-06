module.exports = {
   ensureAuth = (req,res,next) =>{
      if(req.isAuthenticated()){
         return next();
      }
      req.flash('error-msg', 'Sem autorização')
      res.redirect('/user/login')
   }
}