const clody = require("../cloud");
let imgUrl;

exports.uploadImg = async (newimg) => {
  const uploader = async (path) => await clody.uploads(path);
  let urls = [];
  const newpath = await uploader(newimg);
  urls.push(newpath);
  imgUrl = urls.map((p) => {
    console.log({ p });

    return p.url;
  });
  console.log({ imgUrl });

  return {
    img: imgUrl[0],
  };
};
