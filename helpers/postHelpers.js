const path = require("path")
module.exports = {

   checkFile: (file) => {
      if (!file) {
         return true;
      }
      const image = file.image
      const extension = path.extname(image.name)
      return {
         image,
         extension
      }
   },
   checkExtension: (file, mimetype) => {
      if (mimetype !== 'image/jpg' || mimetype !== 'image/jpeg' || mimetype !== 'image/png') {
         req.flash("error_msg", "O arquivo enviado não é uma imagem")
         return res.redirect('/user/add')
      }
   },
   saveFile: (file) => {
      const imgPath = `/images/${Date.now().toString()} - ${image.md5}${extension}`
      file.mv(`.${imgPath}`, err => next(err))
      return imgPath;
   }

}