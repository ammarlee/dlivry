var path = require('path');
const Product =require(path.join(__dirname,'../../models/product'))
const Review = require(path.join(__dirname,'../../models/review'))
const algoliasearch = require("algoliasearch");
const client = algoliasearch("SRG9R6FP41", "a10e35ddd54011feeb240cf013c0f9b0");
const index = client.initIndex("amazontest");
const nodeMailer = require('nodemailer')
const nodegride = require('nodemailer-sendgrid-transport')
const {cloudinary} = require('../cloudinary')
const transporter = nodeMailer.createTransport(nodegride({

  auth:{
    api_key:"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"
  }
}))


 
  //  product details
  exports.getProductDetails=(req,res,next)=>{
      const  productId = req.params.id
     return Product.findOne({_id:productId}).lean().then((product)=>{
         res.status(200).json({product ,success:true});
      }).catch(err=>{
        res.status(400).json(err)
      })
  }
  
  exports.filterProduct=async(req,res,next)=>{
    let page=req.query.page *1 ||1;
    let limit=req.query.limit *1 ||6;
    let skip = (page-1) *limit;
    let {categories,subCategory,color,size} = req.body
    let query ={ category: { $in: categories}, }
    if (subCategory) query.subChildCategory = { $in: subCategory}
    if (color) query.color = { $in: color}
    if (size) query.size = { $in: size}

    try {
      const count = await Product.find(query).count()
      const products = await  Product.find(query).skip(skip).limit(limit)
      res.status(200).json({
        success:true,
        products,
        hasNextPage :limit * page < count,
        hasPerviousPage :page >1,
        count,
        lastPage :Math.ceil(count / limit)
        
      })
      
    } catch (error) {
      res.status(400).json({
        success:false,
        error
      })
    }

  }
  exports.homePage=async (req,res,next)=>{
    try {
      const products =await Product.find({})
      .populate({
        path: 'category ',
        select: 'name _id'
      }).exec()
      
      res.status(200).json({
        success:true,
        posts:products
        
      })
      
    } catch (error) {
      res.status(400).json({
        success:false,
        error
        
      })
    }
  }
  exports.searching=(req,res,next)=>{
    index.search(req.body.name).then((result)=>{
       return res.status(200).json( result.hits)
     })
     .catch((error)=>{
       return  res.status(401).json(error)
     })
 }

  exports.createReview=async(req,res,next)=>{
    const {title,description,userId,productId,rating,} = req.body
    try {
        const newReview = new Review({
          title,description,creatorId:userId,productId,rating
        })
      const response = await Product.findOneAndUpdate({_id:productId},{rating:newReview._id})
      newReview.save()
     res.status(200).json({
      response,
      msg:'you have added a new review'
    })
      
    } catch (err) {
      res.status(400).json({
        err,
         msg:'you have an wrror with  added a new review'
       })
    }
  }
  exports.fetchReviews=(req,res,next)=>{
    const productId = req.params.productId
    Review.find({productId}).populate('creatorId').exec().then((review)=>{
      res.status(200).json({
        review,
        success:true
       })
    }).catch((err)=>{
      res.status(400).json({
        err,
         msg:'you have an wrror with getting review'
       })
    })
  }
  
