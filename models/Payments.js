const mongoose = require("mongoose")
const Schema = mongoose.Schema
const PaymentsSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      paymentId:{type: String,required:true},
      total:String,
      date:Date,
})
module.exports = mongoose.model('Payments', PaymentsSchema);
