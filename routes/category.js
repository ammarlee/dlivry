
const path = require('path')
const express = require("express")
const router = express.Router()
const CategoryController = require(path.join(__dirname,'../controlles/category/category'))
const {protect,restrictRoutes} =require(path.join(__dirname,'./protect/protect')) 
const upload = require(path.join(__dirname, "../controlles/multer"));


// router.post('/add-category',  protect,
// restrictRoutes("admin"),CategoryController.createCategory)

router.post('/add-category',protect,
restrictRoutes("admin"),upload.array("files", 10),CategoryController.createCategory)

// router.post('/category-edit',  upload.array("files", 10),
// restrictRoutes("admin"),CategoryController.editCategory)
router.post('/category-edit',protect,
restrictRoutes("admin"),upload.array("files", 10),CategoryController.editCategory)

router.post('/delete-category/:id',protect,
restrictRoutes("admin"),CategoryController.deleteCategory)

router.get('/get-category',CategoryController.getCategory)
module.exports = router
