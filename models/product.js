const mongoose = require("mongoose")
const mongooseAlgolia = require('mongoose-algolia')
const Schema = mongoose.Schema
const ProductSchema = new Schema({
   
    name:{
        type:String,
        required:true

    },
    category:{
        type:Schema.Types.ObjectId,
        ref:'Category',
        required:true 
        
    },
    price:{
        type:Number,
        required:true
        
    },
    rating:{
        type:Schema.Types.ObjectId,
        ref:'Review'
    },
    img:{
        type:Array
    },
    description:{
        type:String,
        required:true
    },
    
    quantity:{
        type:Number,
        required:false
    },
    size:Number,
    
    
})
const algolia_api ='a10e35ddd54011feeb240cf013c0f9b0'
const application_id = 'SRG9R6FP41'
const application_index='amazontest'
ProductSchema.plugin(mongooseAlgolia, {
    appId: application_id,
    apiKey: algolia_api,
    indexName: application_index, 
    selector: 'id name price  quantity category img description ', 
    // populate: {
    //   path: 'userId',
    //   select:'name'
    // },
    debug:true
})
let Model = mongoose.model('Product', ProductSchema)
Model.SyncToAlgolia()
Model.SetAlgoliaSettings({
    searchableAttributes: ['name', 'category'], 
  })
module.exports =Model
