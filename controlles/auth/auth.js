var path = require("path");
const User = require(path.join(__dirname, "../../models/user"));
var jwt = require("jsonwebtoken");
const bycript = require("bcryptjs");
const crypto = require("crypto");
const nodeMailer = require("nodemailer");
const { body, validationResult } = require("express-validator");
const nodegride = require("nodemailer-sendgrid-transport");
var jwt = require("jsonwebtoken");
const { imgUploader } = require("../admin/imgUploader");

const signToken = (id) => {
  return jwt.sign({ id }, "shhhhh", {
    expiresIn: "30 days",
  });
};

const transporter = nodeMailer.createTransport(
  nodegride({
    auth: {
      api_key: "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",
    },
  })
);

// Your new Phone Number is +16062683563

// SINGUP NEW USER TO THE DATABASE
exports.signUp = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(401).json({
      errors: errors.array()[0].msg,
    });
  }
  bycript.hash(req.body.password, 12, (error, hashedpassword) => {
    if (error) {
      return res.status(401).json({
        error,
        success: false,
      });
    }
    const { username, email, phone, img } = req.body;

    const user = new User({
      password: hashedpassword,
      username: username.trim().toLowerCase(),
      phone,
      img,
      email,
    });

    return user
      .save()
      .then((user) => {
        const token = signToken(user._id);

        req.session.user = user;
        req.session.token = token;
        req.session.isAuthanticated = true;
        req.session.date = {
          date: new Date().toLocaleDateString(),
          hour: new Date().toISOString(),
        };
  


        res.status(200).json({
          status: "success",
          user,
          token: token,
          authanticated: true,
          msgs: {
            ar: "أضاف مستخدم جديد",
            eng: "new user have added",
            kur: "bikarhênerek nû lê zêde kiriye",
          },
        });
      })
      .catch((err) => {
        res.status(400).json({
          success: false,
          msgs: {
            ar: "اسم المستخدم موجود بالفعل",
            eng: "username already in exist",
            kur: "navê bikarhêner jixwe heye",
          },
        });
      });
  });
};

// LOGIN WITH YOUR EMAIL AND PASSWORD
exports.login = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(401).json({
      errors: errors.array()[0].msg,
    });
  }
  const username = req.body.username;
  User.findOne({ username: username.trim().toLowerCase() })
    .then((user) => {
      var token = signToken(user._id);
      req.session.user = user;
      req.session.token = token;
      req.session.isAuthanticated = true;
      req.session.date = {
        date: new Date().toLocaleDateString(),
        hour: new Date().toISOString(),
      };

      return res.status(200).send({
        user: user.toJSON(),
        authanticated: true,
        token: token,
        success: true,
        msgs: {
          ar: "قمت بتسجيل الدخول",
          eng: "you have logged ",
          kur: "te qeyd kiriye",
        },
      });
    })
    .catch((error) => {
      return res.status(400).send({
        msg: "error with authantication",
        success: false,
        error,
      });
    });
};

// LOG OUT THE CUTRRENT USER
exports.logOut = (req, res, next) => {
  req.session.destroy(function (err) {
    // cannot access session here
    if (err) {
      return res.status(500).send({
        error: "error with authantication",
      });
    }
    console.log("u have loged out ");
    return res.status(200).json({
      msg: "you have logged out succefull",
    });
  });
};

const client = require("twilio")("AC42389e5d0ff37c7425405d076d42eb07", "fedd4cae1d6c6cdd1b70a3d189607b96");

exports.forForgetPassword = (req, res, next) => {
  const { phone, token } = req.body;
  User.findOne({ phone })
    .then((user) => {
      if (!user) {
        return res.status(400).json({
          success: false,
          error: "your phone is not  exist yet",
          msgs: {
            ar: "رقم هاتفك غير موجود",
            eng: "your phone number is not  exist ",
            kur: "hejmara telefona te tune ye",
          },
        });
      }
      // Your new Phone Number is +16062683563

      user.resetToken = token;
      return user.save().then(() => {
        return res.status(200).json({
          success: true,
          token,
          msgs: {
            ar: "قمت بإرسال رقم إلى رقم هاتفك",
            eng: "have sent a number to your phone number ",
            kur: "jimareyek ji hejmara têlefona xwe re şandiye",
          },
        });
      });
      // then(() => {
      //   client.messages
      //     .create({
      //       body: "please write this valid number to reset password",
      //       from: "+16062683563",
      //       to: "+201060612342",
      //     })
      //     .then((message) => {
      //       console.log(message.sid);
      //       return res.status(200).json({
      //         success: true,
      //         msg: "we have sent a massege to your email to reset password",
      //       });
      //     });
      // });
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json({
        success: false,
        err,
      });
    });
};
exports.changePassword = async (req, res, next) => {
  try {
    const { _id, newPassword } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(401).json({
        errors: errors.array()[0].msg,
      });
    }
    const user = await User.findOne({ _id });
    const hashedpassword = await bycript.hash(newPassword, 12);
    user.password = hashedpassword;
    user.resetToken = null;
    user.save();
    return res.status(200).json({
      success: true,
      user,
      msgs: {
        ar: "لقد قمت بتغيير كلمة المرور الخاصة بك بنجاح",
        eng: "you have changed your password successfully",
        kur: "te şîfreya xwe bi serkeftî guhertiye",
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      err,
    });
  }
};

exports.resetAfterForget = async (req, res, next) => {
  const { phone, token, password, secPassword } = req.body;
  try {
    const user = await User.findOne({ phone, resetToken: token });
    if (!user) {
      return res.status(400).json({
        success: false,
        msgs: {
          ar: "هذا المستخدم غير موجود",
          eng: "this user is not exist",
          kur: "bikarhêner tune ye",
        },
      });
    }
    if (password === secPassword) {
      bycript.hash(req.body.password, 12, (error, hashedpassword) => {
        if (error) {
          return res.status(401).json({
            success: false,
            err: "error with hash password",
          });
        }
        user.password = hashedpassword;
        user.resetToken = null;
        user.save();
        return res.status(200).json({
          success: true,
          msgs: {
            ar: "لقد قمت بتغيير كلمة المرور الخاصة بك بنجاح",
            eng: "you have changed your password successfully",
            kur: "te şîfreya xwe bi serkeftî guhertiye",
          },
        });
      });
    } else {
      return res.status(400).json({
        success: false,
        msgs: {
          ar: "كلمة المرور الخاصة بك غير متطابقة",
          eng: "your password is not match",
          kur: "şîfreya te li hev nayê",
        },
      });
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      err: error,
    });
  }
};

exports.EditProfile = async (req, res, next) => {
  const { username, email, _id, phone } = req.body;

  try {
    const user = await User.findOneAndUpdate({ _id }, { username, email, phone} , { new: true });
    return res.status(200).json({
      user,
      token:req.session.token,
      msgs: {
        ar: "لقد قمت بتحديث ملف التعريف الخاص بك بنجاح",
        eng: "you have updated your profile successfully",
        kur: "Te profîla xwe bi serkeftî nû kir",
      },
    });
  } catch (error) {
    res.status(400).json({ error, successful: false , msgs: {
      ar: "لقد قمت بتحديث ملف التعريف الخاص بك بنجاح",
      eng: "you have updated your profile successfully",
      kur: "Te profîla xwe bi serkeftî nû kir",
    },});
  }
};

exports.updateImg = async (req, res, next) => {
  const { _id } = req.body;
  const files = req.files;
  try {
    if (files && files.length > 0) {
      const images = await imgUploader(files);
      const user = await User.findOneAndUpdate({ _id }, { img: images[0] }, { new: true });
      res.status(200).json({
        user,
        token:req.session.token,
        msgs: {
          ar: "لقد قمت بتحرير صورة ملفك الشخصي بنجاح",
          eng: "you have edited your profile image successfully",
          kur: "te wêneyê profîla xwe bi serkeftî guhert",
        },
      });
    } else {
      res.status(400).json({
        msgs: {
          ar: "عليك تحميل الصورة",
          eng: "you have to upload photo",
          kur: "divê hûn wêneyê bar bikin",
        },
      });
    }
  } catch (error) {
    res.status(400).json({ error, successful: false });
  }
};
//  GET  USER`S data
exports.userData = async (req, res, next) => {
  const userId = req.params.id;
  try {
    const user = await User.findOne({ _id: userId });
    console.log(req.session.token);
    res.status(200).json({
      success: true,
      user,
      token: req.session.token,
      msgs: {
        ar: "جلب جميع بيانات المستخدم",
        eng: "fetching user all user data",
        kur: "hemî daneyên bikarhênerê bikarhêner digire",
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msgs: {
        ar: "هذا المستخدم غير موجود",
        eng: "this user is not exist",
        kur: "bikarhêner tune ye",
      },
      error,
    });
  }
};
