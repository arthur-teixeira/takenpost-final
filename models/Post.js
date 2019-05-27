const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const PostSchema = new Schema({
   imgPath: {
      type: String,
      required: true
   },
   caption: {
      type: String
   },
   allowComments: {
      type: Boolean,
      default: true
   },
   comments: [{
      commentBody: {
         type: String,
         required: true
      },
      commentDate: {
         type: Date,
         default: Date.now
      },
      commentUser: {
         type: String,
         required: true
      }
   }],
   user: {
      type: Schema.Types.ObjectId,
      ref: 'users'
   },
   date: {
      type: Date,
      default: Date.now
   }
})

mongoose.model("posts", PostSchema, 'posts')