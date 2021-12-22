const path = require("path");
var express = require("express");
var router = express.Router();
const AuthController = require(path.join(__dirname, "../controlles/auth/auth"));
const { body, validationResult } = require("express-validator");
const { check } = require("express-validator");
const bycript = require("bcryptjs");
const upload = require(path.join(__dirname, "../controlles/multer"));
const User = require(path.join(__dirname, "../models/user"));
const { protect } = require(path.join(__dirname, "./protect/protect"));

// signup user
router.post(
  "/user/signup",
  [
    // username
    body("username")
      .isLength({ min: 5, max: 20 })
      .withMessage({
        msgs: {
          ar: "يجب أن يكون اسمًا صحيح",
          eng: "it should be a valid name",
          kur: "divê ew navekî derbasdar be",
        },
      })
      .custom((value) => {
        let name = value.trim().toLowerCase();
        return User.findOne({ username: name }).then((user) => {
          if (user) {
            if (user.username == name) {
              return Promise.reject({
                msgs: {
                  ar: "اسم المستخدم موجود بالفعل",
                  eng: "username already in exist",
                  kur: "navê bikarhêner jixwe heye",
                },
              });
            }
          }
        });
      }),
      // email
      body("email").normalizeEmail().isEmail()
      .withMessage({
        msgs: {
          ar: "يجب أن يكون ايميل صحيح",
          eng: "it should be a valid email",
          kur: "divê ew e-nameyek derbasdar be",
        },
      })
      .custom((value) => {
        return User.findOne({ email:value}).then((user) => {
          if (user) {
            if (user.email == value) {
              return Promise.reject({
                msgs: {
                  ar: "البريد الإلكتروني موجود بالفعل",
                  eng: "email already in exist",
                  kur: "e-name jixwe heye",
                },
              });
            }
          }
        });
      }),

      // phone
      body("phone")
      .isLength({ min: 10, max: 20 })
      .withMessage({
        msgs: {
          ar: "يجب أن يكون رقم صحيح",
          eng: "it should be a valid number phone",
          kur: "divê ew têlefonek jimareyek derbasdar be ",
        },
      })
      .custom((value) => {
        return User.findOne({ phone: value }).then((user) => {
          if (user) {
            if (user.phone == value) {
              return Promise.reject({
                msgs: {
                  ar: "رقم الهاتف موجود بالفعل",
                  eng: "phone number already in exist",
                  kur: "hejmara telefonê jixwe heye",
                },
              });
            }
          }
        });
      }),
    body("password")
      .isLength({ min: 8, max: 20 })
      .withMessage({
        msgs: {
          ar: "يجب أن تتكون كلمة مرورك من 7 أرقام على الأقل",
          eng: "your password should be  at least 7 numbers",
          kur: "şîfreya te divê herî kêm 7 hejmar be",
        },
      }),
  ],
  AuthController.signUp
);
router.get("/fetchuserdata/:id", protect, AuthController.userData);

router.put("/user/edit-profile", protect, AuthController.EditProfile);
router.put(
  "/user/update-img",
  protect,
  upload.array("files", 10),
  AuthController.updateImg
);
router.post("/user/forgetpw", AuthController.forForgetPassword);
router.put("/user/resetAfterForget", AuthController.resetAfterForget);
router.put(
  "/user/change-password",
  protect,
  [
    body("password").custom((value, { req }) => {
      return User.findOne({ _id: req.body._id }).then((user) => {
        if (user) {
          return bycript.compare(value, user.password).then((correct) => {
            if (correct) {
              return user;
            } else {
              return Promise.reject({
                msgs: {
                  ar: "كلمة مرورك خاطئة",
                  eng: "your password is wrong ",
                  kur: "şîfreya te xelet e",
                },
              });
            }
          });
        }
      });
    }),
  ],
  AuthController.changePassword
);

router.post("/user/logout", AuthController.logOut);
// login section
router.post(
  "/user/login",
  [
    body("username").custom((value) => {
      console.log(JSON.stringify(value));
      console.log(value);
      return User.findOne({ username: value.trim().toLowerCase() }).then(
        (user) => {
          if (!user) {
            return Promise.reject({
              msgs: {
                ar: "هذا المستخدم غير موجود",
                eng: "this user is not exist",
                kur: "bikarhêner tune ye",
              },
            });
          }
        }
      );
    }),
    body("password").custom((value, { req }) => {
      return User.findOne({ username: req.body.username }).then((user) => {
        if (user) {
          return bycript.compare(value, user.password).then((correct) => {
            if (correct) {
              return user;
            } else {
              return Promise.reject({
                msgs: {
                  ar: "كلمة مرورك خاطئة",
                  eng: "your password is wrong ",
                  kur: "şîfreya te xelet e",
                },
              });
            }
          });
        }
      });
    }),
  ],
  AuthController.login
);

module.exports = router;
