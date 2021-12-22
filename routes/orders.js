const path = require("path");
const express = require("express");
const router = express.Router();
const orderController = require(path.join(
  __dirname,
  "../controlles/order/order"
));
const { protect, restrictRoutes } = require(path.join(
  __dirname,
  "./protect/protect"
));

router.post("/make/makeOrder",protect, orderController.makeOrder);
router.post("/rate-order",protect, orderController.rateOrder);
router.delete("/delete-order",protect, orderController.deleteOrder);
router.get("/get/orders/:id",protect, orderController.getUserOrders);
router.get("/get/single-order/:id",protect, orderController.getSingleOrder);

module.exports = router;
