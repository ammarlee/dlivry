const mongoose = require("mongoose");
const Schema = mongoose.Schema
const CartSchema = new Schema({
    
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        number: String,
        address: String,
        products: [
          {
            productId: mongoose.Schema.Types.ObjectId,
            quantity: Number,
            name: String,
            price: Number,
            img:String,
            description:String,
            category:String
          }
        ],
        active: {
          type: Boolean,
          default: true
        },
        modifiedOn: {
          type: Date,
          default: Date.now
        },
        total: {
            type: Number,
            
          }
      },  
    { timestamps: true },
   

)

module.exports = mongoose.model('Cart',CartSchema)