const express = require("express")
const router = express.Router();


//root
router.get('/',(req,res) =>{
   res.render("index/welcome")
})

module.exports = router