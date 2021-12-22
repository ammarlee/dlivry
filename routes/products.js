const path = require('path')
const express = require('express')
const router = express.Router()
const productController = require(path.join(__dirname,'../controlles/product/products'))
const {protect,restrictRoutes} =require(path.join(__dirname,'./protect/protect')) 

router.get('/home',productController.homePage)
router.post('/product/search',productController.searching)
router.post('/filter-product',productController.filterProduct)

router.post('/add-review',protect,productController.createReview)
router.get('/review/:productId',productController.fetchReviews)

  // router.post('/productId/:id',productController.getProductDetails)
router.get('/product/:id',productController.getProductDetails)

module.exports = router