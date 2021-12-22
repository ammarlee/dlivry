const mongoose = require("mongoose")

const Schema = mongoose.Schema
const OrderSchema = new Schema({
   
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
      },
      products:{
        type:Array,
        required:true
      },
      commission: {
        type:Number,
        required:true
      },
      type:{
        type:Number,
        required:true
      },
      rate:String,
      description:String,
      address:{
        type:String,
        required:true
      },
      total:{
        type:Number,
        required:true
      },
      orderCount:{
        type:Number,
        required:true
      },
      totalQuantity:{
        type:Number,
        required:true
      },

      date:String,
      phone:{
        type:String,
        require:true
      }
})
module.exports = mongoose.model('Order', OrderSchema);
