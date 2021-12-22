const path = require("path");
const express = require("express");
const router = express.Router();
const { protect, restrictRoutes } = require(path.join(
  __dirname,
  "./protect/protect"
));

const CardController = require("../controlles/card/card");

router.post("/decrease/cart", CardController.decreaseCard);
router.post("/setCartInfo/cart", CardController.setCardInfo);
router.post("/add/addCart", CardController.addToCart);
router.get("/get-single-cart/:id", CardController.getUserCart);


router.post("/delete/cart", CardController.deleteItemFromcart);
router.post("/delete/clear", CardController.clearCart);

module.exports = router;
