const express = require("express");
const docController = require("../controllers/doctorController");
const docRouter = express.Router();
docRouter.route("/addnew").post(docController.addnew  );
docRouter.route("/findone").post(docController.findone  );
docRouter.route("/traertodos").post(docController.traertodos  );

module.exports = docRouter;