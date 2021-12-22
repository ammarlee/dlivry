const express = require('express')
const path = require('path')
const router = express.Router()
const CouponController = require(path.join(__dirname,'../controlles/coupon/Coupon.js'))
const {protect,restrictRoutes} =require(path.join(__dirname,'./protect/protect')) 

router.post('/create-coupon',protect,
restrictRoutes("admin"),CouponController.createCoupon)
router.post('/checkCoupon',CouponController.checkCoupon)

router.get('/fetch-coupons',CouponController.fetchCoupons)
router.post('/edit-coupon',protect,
restrictRoutes("admin"),CouponController.editCoupon)

router.post('/delete-coupon/:id',protect,
restrictRoutes("admin"),CouponController.deleteCoupon)
router.post('/coupon-details',protect,
restrictRoutes("admin"),CouponController.getCouponDetails)
router.post('/search-details',protect,
restrictRoutes("admin"),CouponController.searchForDetails)

module.exports =router