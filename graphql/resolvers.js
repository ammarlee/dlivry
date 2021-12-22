const User = require("../models/user");
const Products = require("../models/product");
module.exports = {
  hello() {
    return {
      text: "hello gues",
      viwes: 250,
      name: "ammar lee",
      age: 11,
      city: "egypt",
    };
  },
  fetchProducts: async function () {
    const products = await Products.find({}).lean();
    return {
      posts: products.map((i) => {
        return {
          _id: i._id.toString(),
          discription: i.discription,
        };
      }),
    };
  },
  loginUser: async function ({ userinput }, req) {
    const existingUser = await User.findOne({ email: userinput.email });
    if (existingUser) {
      if (existingUser.password === userinput.password) {
        return {
          name: existingUser.name,
          email: existingUser.email,
          bio: existingUser.bio,
          phone: existingUser.phone,
        };
      } else {
        const error = new Error(`password is wrong`);
        return error;
      }
    } else {
      const error = new Error(`email does not exist`);
      return error;
    }
  },
  creatUser: async function ({ userinput }, req) {
    const existingUser = await User.findOne({ email: userinput.email });
    if (existingUser) {
      const error = new Error(`User is already exist`);
      return error;
    } else {
      const user = new User({
        name: userinput.name,
        email: userinput.email,
        password: userinput.password,
        bio: userinput.bio,
        phone: userinput.phone,
      });
      let newUser = await user.save();
      return {
        _id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        phone: newUser.phone,
      };
    }
  },
  product:async function({id},req){
    const product = await Products.findOne({_id:id}).populate('userId')
    console.log(product);
   
    return {
      ...product._doc,
      userId:product.userId,
      _id: product._id.toString(),
    }
  }
};
