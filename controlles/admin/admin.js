var path = require("path");
const Product = require(path.join(__dirname, "../../models/product"));
const User = require(path.join(__dirname, "../../models/user"));
const Socket = require(path.join(__dirname, "../../socket"));
const { imgUploader } = require("./imgUploader");

// create PRODUCT
exports.CreateProduct = async (req, res, next) => {
  const  { name, price, quantity, category, description, size,} = req.body
  const files = req.files;
  let product;
  let productData = {
    name,
    price,
    quantity,
    category,
    description,
    size,
  
  };
  try {
    if (files && files.length > 0) {
      const images = await imgUploader(files);
      productData.img = images;
      product = new Product(productData);
    } else {
      // product = new Product(productData);
      return res.status(400).json({msg:'you have to upload img '})
    }
    const products = await product.save();
    Socket.getIO().emit("category", {
      action: "createProduct",
      product: products,
      msg: "new product has been added ",
    });
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(400).json({ error, success: false });
  }
};
exports.getProductwithCategory =async (req, res, next) => {
  let page=req.query.page *1 ||1;
    let limit=req.query.limit *1 ||6;
    let skip = (page-1) *limit;
    let {categoryId} = req.body
    let query ={ category: { $in: categoryId}, }

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
// EDIT PRODUCT
exports.editProduct = async (req, res, next) => {
  let product = req.body
  product._id =req.params.id
  let { name, price, quantity, category, description, size, } =
    product;
  let productData = { name, price, quantity, category, description, size,};
  let edited;
  try {
    const files = req.files;
    if (files && files.length > 0) {
      const images = await imgUploader(files);
      productData.img = images;
      edited = await Product.findOneAndUpdate(
        { _id: product._id },
        { $set: productData },
        { new: true }
      );
      return  res.status(200).json({
        success: true,
        post: edited,
        msg: "you have edited product",
      });
    } else {
      edited = await Product.findOneAndUpdate(
        { _id: product._id },
        { $set: productData },
        { new: true }
      );
      return  res.status(200).json({
        success: true,
        post: edited,
        msg: "you have edited product",
      });
    }

  } catch (error) {
    res.status(401).json({
      success: false,
      msg: "you coludnt  have edit the product",
    });
  }
};
exports.chargeClientStock = async (req,res,next)=>{
  try {
    const {_id,quantity} = req.body
    const user = await User.findOne({_id})
    if (!user) res.status(400).json({success: false, msg: "there is not a user with that id"})
    user.stock += +quantity
    user.notifications.push({
      title:`you have charged user stock successfully with ${quantity}`,
      date:Date.now()
    })
    await user.save()
    res.status(200).json({success: true, msg: "you have charged user stock successfully",user})
    
    
  } catch (error) {
    res.status(401).json({success: false, msg: "you colud do that ",error})
  }
}
// delete product
exports.deleteProduct =async (req, res, next) => {
  const productId = req.params.id;
  try {
    const product = await Product.findOneAndRemove({ _id: productId })
    Socket.getIO().emit("category", { action: "deleteProduct", product });
    res.status(200).json({
      success: true,
      msg: "you have deleted product",
      product,
    });
    
  } catch (error) {
    res.status(401).json({
      success: false,
      msg: "you coludnt  have deleted the product",
    });
    
  }
  
};
