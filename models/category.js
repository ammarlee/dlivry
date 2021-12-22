const mongoose = require("mongoose");
const Schema = mongoose.Schema
const CategorySchema = new Schema({
    name:{type:String ,unique:true},
    img:{type:String},
    description:String,
   
})
module.exports = mongoose.model('Category', CategorySchema);
