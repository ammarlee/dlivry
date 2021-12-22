const path = require("path");
const fs = require("fs");
const Payments = require(path.join(__dirname,"../../models/Payments"));
const stripe = require("stripe")(
  "sk_test_51HW8XsFcp3bB6NpnSJmsJgGkxC9zyhQxphOeKnPZMvBFrxmhrjsdCTTkY3JY3PPxgkhX3ybehnzPUJMyeJFo4tOX00YXDpMXdU"
);

// const currentUrl = "http://localhost:8080";
const currentUrl = "https://ammarshop.herokuapp.com/"

exports.checkPayment = async (req, res, next) => {
  try {
    const { userId, id } = req.body;
    const session = await stripe.checkout.sessions.retrieve(id);
    if (session) {
      const response = await Payments.findOne({ paymentId: session.id });
      if (response) {
        res.status(500).json({ msg: `this is used before` });
      } else {
        const newPayment = await Payments.create({
          paymentId: session.id,
          userId,
          date: new Date(),
          total: session.amount_subtotal,
        });
        await newPayment.save();
        res.status(200).json(session);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};
exports.createSession = async (req, res) => {
  const card = req.body;
  let item = [] 
  let filteritems= card.cart.products.forEach((i)=>{
    item.push({
      price_data:{
        currency:"egp",
        unit_amount: i.price,
        product_data: { name: i.name ,images:[i.img],},
        
      },
      quantity:i.quantity
    })
  })
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      allow_promotion_codes: true,
      line_items: item,
      success_url: `${currentUrl}checkpayment/{CHECKOUT_SESSION_ID}`,
      cancel_url: `${currentUrl}`,
    });

    res.json({ id: session.id });
  } catch (error) {
    res.status(400).json(error);
  }
};
