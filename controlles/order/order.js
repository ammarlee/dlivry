var path = require("path");
const Order = require(path.join(__dirname, "../../models/order"));

exports.makeOrder = async (req, res, next) => {
  const { userId, total, products, type, commission, address, phone,totalQuantity } =
    req.body;

  let date = new Date();
  try {
    let orders = await Order.find({  userId }).count();
    console.log({orders});
    const newOrder = await Order.create({
      userId,
      total,
      totalQuantity,
      orderCount:orders +1,
      products,
      type,
      commission,
      address,
      phone,
      date,
    });
    const newOne = await newOrder.save();
    return res.status(200).json({
      order: newOne,
      success: true,
      msgs: {
        ar: "لقد قمت بإجراء طلب جديد بنجاح",
        eng: "you have make a new order successfully",
        kur: "we fermanek nû bi serfirazî çêkir",
      },
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      msgs: {
        ar: "لديك مشكلة في إضافة الطلب",
        eng: "you have a problem with adding order",
        kur: "Pirsgirêka we bi lê zêdekirina fermanê heye",
      },
      error: error.message,
    });
  }
};
exports.deleteOrder = async (req, res, next) => {
  const { orderId } = req.body;
  try {
    const order = await Order.findOneAndRemove({ _id: orderId });
    res.status(200).json({
      success: true,

      msgs: {
        ar: "لقد قمت بحذف الطلب",
        eng: "you have delete the order",
        kur: "te emrê jêbirin",
      },
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      success: false,
    });
  }
};
exports.getSingleOrder = async (req, res, next) => {
  const orderId = req.params.id;
  try {
    let order = await Order.findOne({ _id: orderId });
    if (!order) {
      res.status(400).json({
        msgs: {
          ar: "لم تحصل على أي طلبات حتى الآن",
          eng: "you have not`t any orders yet",
          kur: "we hê emir negirtiye",
        },
      });
    } else {
      res.status(200).json({
        success: true,
        order,
      });
    }
  } catch (error) {
    res.status(400).json({
      error: error.message,
      success: false,
      msgs: {
        ar: "لم تحصل على أي طلبات حتى الآن",
        eng: "you have not`t any orders yet",
        kur: "we hê emir negirtiye",
      },
    });
  }
};

exports.rateOrder = async (req, res, next) => {
  const { orderId, rate, description } = req.body;
  try {
    const order = await Order.findOneAndUpdate(
      { _id: orderId },
      { rate, description },
      { new: true }
    );
    res.status(200).json({
      success: true,
      order,
      msg:'you have update rate and description for order'
    });

  } catch (error) {
    res.status(400).json({
      error: error.message,
      success: false,
    });
  }
};
exports.getUserOrders = async (req, res, next) => {
  const userId = req.params.id;
  let user;
  userId == "null" ? (user = {}) : (user = { userId });
  try {
    let orders = await Order.find(user)
      .sort({ "items.date": -1 })
      .populate({
        path: "userId",
        select: "name _id",
      })
      .exec();
    if (!orders) {
      res.status(400).json({
        msgs: {
          ar: "لم تحصل على أي طلبات حتى الآن",
          eng: "you have not`t any orders yet",
          kur: "we hê emir negirtiye",
        },
      });
    } else {
      res.status(200).json({
        success: true,
        orders,
      });
    }
  } catch (error) {
    res.status(400).json({
      err,
      success: false,
      error: error.message,

    });
  }
};
