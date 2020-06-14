const express = require("express");
const router = express.Router();
const ctrl = require("./messages.controller");
const { paramsById } = require("./messages.validations");

router.get("/messages", ctrl.getMessage);
router.get("/messages/:id", paramsById, ctrl.getMessageById);
router.post("/messages", ctrl.addMessage);
router.put("/messages/:id", paramsById, ctrl.updateMessage);
router.delete("/messages/:id", paramsById, ctrl.deleteMessage);

module.exports = router;
