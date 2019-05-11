

module.exports = {
    getAdd:(req,res) =>{
        res.render("user/add")
     },
     postAdd:(req,res) =>{
        let allowComments;
        req.body.allowComments 
        ? allowComments = true 
        : allowComments = false
  
        const newPost = {
           image: req.body.image,
           caption: req.body.legenda,
           allowComments,
           user: req.user.id
        }
  
        new Post(newPost).save()
           .then(post =>{
              res.redirect(`/user/show/${post.id}`)
           })
     },
     showPosts:(req,res) =>{
        let postid = req.params.id;
        Post.findOne({ _id:postid})
        .then(post =>{
           res.render("user/show", {post})
        }) 
     }
}