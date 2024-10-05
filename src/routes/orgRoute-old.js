const express = require("express");
const orgController = require("../controllers/orgController");
const orgRouter = express.Router();
orgRouter.route("/addnew").post(orgController.addnew  );
orgRouter.route("/findCode").post(orgController.findCode  );
orgRouter.route("/update").post(orgController.update);
orgRouter.route("/traertodos").post(orgController.traertodos);

module.exports = orgRouter;