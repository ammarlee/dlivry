const multer=require('multer')
const path = require('path')
const fs = require('fs')
 

const fileStorage = multer.diskStorage({
    destination:(req,file,cb)=>{
      var dir = path.join("./uploads");
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      cb(null,'uploads')
    },
    filename:(req,file,cb)=>{
      // cb(null,file.originalname)
      cb(null,  Date.now() +'-' +file.originalname )
    }
  })
let upload = multer({storage:fileStorage})
module.exports =upload