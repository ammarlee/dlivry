const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "ammarleejot",
  api_key: "898697172461775",
  api_secret: "xVPvW1xPnou2py68mrTPqbiJ3zg",
});
exports.uploads = (file) => {
  return new Promise((resolv) => {
    console.log("function start");
    cloudinary.uploader.upload(file, (error, result) => {
      console.log(error);
      if (!error) {
        console.log({ result });
        resolv({
          url: result.secure_url,
          id: result.public_id,
        });
      }
    });
    // cloudinary.uploader.upload(file,(result)=>{
    //     resolv({
    //         url:result.url,
    //         id:result.public_id
    //     })
    // },{
    //     resource_type:'auto',
    //     folder:folder

    // })
  });
};
