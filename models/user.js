const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  role: { type: String, default: "resturant", enum: ["admin", "driver", "resturant"] },
  email: {
    type: String,
    unique: true,
  },
  notifications:[],
  img: {
    type: String,
    default:null
  },
  stock:{
    type: Number,
    default:100,
    
  },
  
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    unique: true,
    required: true,

  },
  resetToken: {
    type: String,
  },
});

module.exports = mongoose.model("User", userSchema);
