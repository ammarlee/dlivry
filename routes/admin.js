const path = require("path");
const express = require("express");
const router = express.Router();
const adminController = require(path.join(
  __dirname,
  "../controlles/admin/admin"
));
const { protect, restrictRoutes } = require(path.join(
  __dirname,
  "./protect/protect"
));

const upload = require(path.join(__dirname, "../controlles/multer"));

router.post(
  "/file-upload",
  upload.array("files", 10),
  protect,
  restrictRoutes("admin"),
  adminController.CreateProduct
);
router.put("/charge-stock",protect,
restrictRoutes("admin"),adminController.chargeClientStock)
router.post("/products-with-category", adminController.getProductwithCategory);
router.put(
  "/file/edit/:id",
  protect,
  restrictRoutes("admin"),
  upload.array("files", 10),
  adminController.editProduct
);
router.delete(
  "/:id",
  protect,
  restrictRoutes("admin"),
  adminController.deleteProduct
);



module.exports = router;
