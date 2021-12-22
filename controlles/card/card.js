var path = require("path");
const Cart = require(path.join(__dirname, "../../models/cart"));

// POST A NEW ITEMS TO THE CARD
exports.addToCart = async (req, res, next) => {
  const { name, productId, price, description, img, category, userId } =
    req.body;
    if (!name || !productId || !price || !description || !img ||!category ||!userId) {
      return res.status(500).json({
        msg: "info not complited",
      });
    }

  if (!userId) {
    return res.status(500).json({
      msg: "you have to login ",
    });
  }
  try {
    let cart = await Cart.findOne({ userId });
    if (cart) {
      let itemIndex = cart.products.findIndex((p) => p.productId == productId);
      if (itemIndex > -1) {
        let productItem = cart.products[itemIndex];
        productItem.quantity += 1;
        cart.total += +price
        cart.products[itemIndex] = productItem;
      } else {
        //product does not exists in cart, add new item
        cart.total = +price
        cart.products.push({
          productId,
          quantity: 1,
          name,
          price,
          description,
          img,
          category,
        });
      }
      cart = await cart.save();
      return res.status(201).send(cart);
    } else {
      //no cart for user, create new cart
      const newCart = await Cart.create({
        userId,
        total : +price,
        products: [
          { productId, quantity: 1, name, price, img, category, description },
        ],
      });
      return res.status(201).send(newCart);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong");
  }
};

exports.decreaseCard = async (req, res, next) => {
  const { productId, userId } = req.body;

  let cart = await Cart.findOne({ userId });
  if (cart) {
    let itemIndex = cart.products.findIndex((p) => p.productId == productId);
    if (itemIndex > -1) {
      let productItem = cart.products[itemIndex];
      cart.total -= +price
      productItem.quantity -= 1;
      cart.products[itemIndex] = productItem;
    }
    cart = await cart.save();
    return res.status(201).send(cart);
  }
};
exports.setCardInfo = async (req, res, next) => {
  try {
    const { number, userId, address } = req.body;
    
    let cart = await Cart.findOneAndUpdate(
      { userId },
      { address, number },
      { new: true }
    );
    return res.status(200).json({ cart, msg: "you have update the info card" });
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
};

exports.getUserCart = (req, res, next) => {
  let userId = req.params.id;
  Cart.findOne({ userId })
    .then((cart) => {
      return res.status(200).json({
        cart
      });
    })
    .catch((err) => {
      return res.status(500).json({
        err: err,
      });
    });
};
exports.deleteItemFromcart = (req, res, next) => {
  const { productId, userId } = req.body;
  let editedId = productId.trim();
  Cart.findOne({ userId }).then((products) => {
    let filteredCart = products.products.filter((item) => {
      return item.productId.toString() !== editedId.toString();
    });
    let oldcart = products;
    Cart.findOneAndUpdate(
      { userId },
      { $set: { products: filteredCart } },
      { new: true },
      (err, doc) => {
        if (err) {
          return res.status(500).json({
            msg: "Something wrong when updating data!",
          });
        }

        return res.status(200).json({
          data: doc,
        });
      }
    );
  });
};
exports.clearCart = (req, res, next) => {
  const userId = req.body.userId;
  Cart.findByIdAndRemove({ userId })
    .then((resu) => {
      res.status(200).json({
        msg: "you have cleared the card successfully",
        cart: null,
      });
    })
    .catch((error) => {
      res.status(500).json({
        msg: "you have an error with clear the card",
        error,
      });
    });
};
