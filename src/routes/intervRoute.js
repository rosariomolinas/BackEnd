const express = require("express");
const intervController = require("../controllers/intervController");
const intervRouter = express.Router();
intervRouter.route("/addnew").post(intervController.addnew  );
intervRouter.route("/findcode").post(intervController.findCode  );
intervRouter.route("/traertodos").post(intervController.traertodos  );



module.exports = intervRouter;