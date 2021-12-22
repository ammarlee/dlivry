const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const Coupon = require(path.join(__dirname,"../../models/Coupon"));

const algoliasearch = require("algoliasearch");
const client = algoliasearch("5AX3QTWUTZ", "51ba31f56313488518c91d7571cddcde");

const Moment = require("moment");
// ______________________________________

// _________________________________________________________

// create new exams and the results also
exports.createCoupon = async (req, res, next) => {
  try {
    const { percentage } = req.body;
    const idnew = crypto.randomBytes(13).toString("hex");
    const couponNumber = idnew;
    const newCoupon = new Coupon({ couponNumber, percentage });

    await newCoupon.save();
    res.status(200).json({ newCoupon, msg: "you have created new coupon" });
  } catch (error) {
    res.status(400).json(error);
  }
};
exports.checkCoupon = async (req, res, next) => {
    try {
        const date = new Date();
        const {couponNumber,userId,card} = req.body;
        const singleCoupon = await Coupon.findOne({couponNumber,isValid:true});
        if (singleCoupon) {
            const editCoupon = await Coupon.findOneAndUpdate(
                { couponNumber },
                { isValid: false, cardDetails: { date, userId, CardId:card._id } },
                { new: true, rawResult: true }
              );
            
              res.status(200).json({msg:'done',coupon:singleCoupon})
        }else{
        res.status(500).json({msg:'not vaild number'})

        }
        
    } catch (error) {
        res.status(400).json({error})
    }
}
exports.deleteCoupon = async (req, res, next) => {
    try {
        let _id = req.params.id;
      let deleteCoupon=await Coupon.findOneAndRemove({ _id})
   
      res.status(200).json({
        success: true,
        msg: "you have deleted product",
        coupon:deleteCoupon,
      });
        
    } catch (error) {
        console.log(error);
        res.status(401).json({
            success: false,
            msg: "you coludnt  have deleted the item",
          });
        
    }
}

exports.editCoupon = async (req, res, next) => {
    try {
      const {_id,percentage} =req.body;
      const editedCoupon = await Coupon.findOneAndUpdate(
        { _id},
        { $set: { percentage} },
        { new: true }
      );
      res.status(200).json({ success: true,coupon:editedCoupon, msg: "edited item" });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error, successful: false });
    }
  };


exports.fetchCoupons = async (req, res, next) => {
  try {
    console.log("fetched !");
    const coupons = await Coupon.find({}).lean();
    res.status(200).json({ success: true, coupons, msg: "get coupons " });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error, successful: false });
  }
};
exports.getCouponDetails = async (req, res, next) => {
  let { serialId, cardId } = req.body;
  let serial;
  try {
    if (serialId) {
      serial = await Ser.findOne({ serialNumber: serialId })
        .populate([
          {
            path: "lectureDetails.studentId",
            model: "Students",
            select: "name age phone ",
          },
          {
            path: "lectureDetails.lectureId",
            model: "Lectures",
            select: "chapter lesson  ",
          },
        ])
        .exec();
    } else if (cardId) {
      serial = await Ser.findOne({ CardId: cardId })
        .populate([
          {
            path: "lectureDetails.studentId",
            model: "Students",
            select: "name age phone ",
          },
          {
            path: "lectureDetails.lectureId",
            model: "Lectures",
            select: "chapter lesson  ",
          },
        ])
        .exec();
    }
    if (serial == null) {
      return res.status(400).json({ msg: "your serial is wrong " });
    }
    res.status(200).json({ serial });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};
exports.searchForDetails = async (req, res, next) => {
  try {
    let { userId, startDate, endDate } = req.body;
    //   const user = await Student.aggregate([
    //     { $match: { _id: userId } },
    //     { $unwind: { "$exams": 1 } },
    //     { $match: { "exams.date":{$gte:new Date(`${startDate}`),
    //   } } },
    //     { $project: { _id: 1, exams: 1 } }
    // ])
    // new Date(`${startDate}`)
    console.log(new Date(`${startDate}`).toISOString());
    console.log(new Date(`${endDate}`).toISOString());

    endDate = new Date(
      new Date(`${endDate}`).setHours(new Date(`${endDate}`).getHours() + 24)
    );

    const mongoose = require("mongoose");
    const user2 = await Student.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(userId) } },
      {
        $project: {
          items: {
            $filter: {
              input: "$exams",
              as: "item",
              cond: {
                $and: [
                  {
                    $gt: [
                      "$$item.date",
                      new Date(`${startDate}`).toISOString(),
                    ],
                  },
                  {
                    $lte: ["$$item.date", new Date(`${endDate}`).toISOString()],
                  },
                ],
              },
            },
          },
        },
      },
    ]);
    console.log(user2);

    res.status(200).json({ user2 });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};
