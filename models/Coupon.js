const mongoose = require("mongoose")

const Schema = mongoose.Schema
const CouponSchema = new Schema({
  couponNumber:String,
  percentage:Number,
 isValid:{type:Boolean,default:true},
 cardDetails:[{
     date:String,
     userId:{ type:Schema.Types.ObjectId, ref:'User'},
     CardId:{ type:Schema.Types.ObjectId, ref:'Cart'}
 }]
 
})
module.exports = mongoose.model('Coupon',CouponSchema);