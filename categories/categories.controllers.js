const CategoryModel = require("./category.model");

const getCategories = async (req, res, next) => {
  try {
    const categories = await CategoryModel.find();

    res.send({
      success: true,
      response: categories
    });
  } catch (err) {
    next(err);
  }
};

const addCategory = async (req, res, next) => {
  try {
    const categorie = await CategoryModel.create({
      name: req.body.name
    });

    res.send({
      success: true,
      response: categorie
    });
  } catch (err) {
    next(err);
  }
};

const updateCategorie = async (req, res, next) => {
  try {
    const categorie = await CategoryModel.findById({
      _id: req.params.categorie_id
    });

    if (!categorie) {
      throw new Error("Categorie not found");
    }

    categorie.name = req.body.name;

    await categorie.save();

    res.send({
      success: true,
      response: categorie
    });
  } catch (err) {
    next(err);
  }
};

const deleteCategorie = async (req, res, next) => {
  try {
    const categorie = await CategoryModel.findOneAndDelete({
      _id: req.params.categorie_id
    });

    res.send({
      success: true,
      response: categorie
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCategories,
  addCategory,
  updateCategorie,
  deleteCategorie
};
