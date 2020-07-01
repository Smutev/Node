const { Router } = require("express");

const {
  getCategories,
  addCategory,
  updateCategorie,
  deleteCategorie
} = require("./categories.controllers");

const router = Router();

router.get("/", getCategories);
router.post("/", addCategory);
router.put("/:categorie_id", updateCategorie);
router.delete("/:categorie_id", deleteCategorie);

module.exports = router;
