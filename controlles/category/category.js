const path = require("path");
const Category = require(path.join(__dirname, "../../models/category"));
const Socket = require(path.join(__dirname, "../../socket"));
const clody = require("../cloud");
const { uploadImg } = require("./uploader");
const { imgUploader } = require("../admin/imgUploader");

exports.editCategory = async (req, res, next) => {
  let { name, description, _id } = req.body;
  const files = req.files;

  let newimg = req.body.img;

  try {
    if (files && files.length > 0) {
      const images = await imgUploader(files);
      const category = await Category.findOneAndUpdate(
        { _id },
        { name, description, img: images[0] },
        { new: true }
      );
      return res
        .status(200)
        .json({ category, success: true, msg: "you have updated" });
    } else {
      const category = await Category.findOneAndUpdate(
        { _id },
        { name, description },
        { new: true }
      );

      return res
        .status(200)
        .json({ category, success: true, msg: "you have updated" });
    }
  } catch (error) {
    res.status(400).json({ error, success: false });
  }
};
exports.createCategory = async (req, res, next) => {
  let { name, description } = req.body;
  const files = req.files;
  try {
    if (files && files.length > 0) {
      const images = await imgUploader(files);
      const category = new Category({ name, description, img: images[0] });
      const newone = await category.save();
      return res
        .status(200)
        .json({ category: newone, success: true, msg: "create new one" });
    } else {
      return res.status(404).json({ msg: "you have to upload photo" });
    }
  } catch (error) {
    return res.status(400).json({ error, success: false });
  }
};

exports.getCategory = async (req, res, next) => {
  try {
    const categoryies = await Category.find({}).lean();
    res.status(200).json({  categoryies, success: true,msg:'all avalible categories' });
  } catch (error) {
    res.status(400).json({ err, success: false });
  }
};
exports.deleteCategory = (req, res, next) => {
  const id = req.params.id;
  Category.findOneAndRemove({ _id: id })
    .then((cat) => {
      Socket.getIO().emit("category", {
        action: "deleteCategory",
        category: cat,
      });
      res.status(200).json({ cat, success: true });
    })
    .catch((err) => {
      res.status(400).json({ err, success: false });
    });
};
