const mongoose = require("mongoose")

const Schema = mongoose.Schema
const ReviewSchema = new Schema({
   productId:{
       type:mongoose.Schema.Types.ObjectId,
       ref:'Product'

   },
   creatorId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'

},
    title:String,
    description:String,
    photo:String,
    rating:Number
    
})
module.exports = mongoose.model('Review', ReviewSchema);
