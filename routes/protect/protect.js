const path = require("path")
const User =require(path.join(__dirname,'../../models/user'))
var jwt = require('jsonwebtoken')
const {promisify} =require('util')

// FUNCTION FOR PROTECT ROUTES WITH JWT
exports.protect = async (req,res,next)=>{
  let token
  try {
  
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    token=req.headers.authorization.split(' ')[1]
  }
  if(!token){
    return res.status(401).json({error:'you are not authanticated',   msgs: {
      ar:'لم يتم توثيقك الرجاء تسجيل الدخول',
      eng:'you are not authenticated please login in',
      kur:'hûn ne rastrastkirî ne ji kerema xwe têkevinê'
    },})
  }
  const decoded = await promisify(jwt.verify)(token,'shhhhh')
  // find if user still exist or not 
  const freshUser = await User.findOne({_id:decoded.id})
  if (!freshUser) {
    return res.status(401).json({
      error:'user not exist yet',
      msgs: {
        ar:'هذا المستخدم غير موجود',
        eng:'this user is not exist',
        kur:'bikarhêner tune ye'
      },
    })
    
  }
  req.userId=freshUser._id
  req.user = freshUser

  next()
} catch (error) {
  res.status(400).json({
    msgs: {
      ar:'إذن العنوان الخاص بك خاطئ',
      eng:'your header  authorization is wrong',
      kur:'destûrnameya sernavê we xelet e'
    },
  })
}

}
exports.restrictRoutes = (...roles)=>{
  return (req,res,next)=>{
    if (!roles.includes(req.user.role)) {
     return res.status(400).json({msg:'you are not admin'})
    }else{
      next()
    }
  }
}