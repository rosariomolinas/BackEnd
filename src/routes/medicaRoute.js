const express = require("express");
const medicaController = require("../controllers/medicaController");
const medicaRouter = express.Router();
medicaRouter.route("/traertodos").post(medicaController.traertodos  );

module.exports = medicaRouter;