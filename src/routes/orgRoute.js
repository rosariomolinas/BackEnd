const express = require("express");
const orgController = require("../controllers/orgController");
const orgRouter = express.Router();
orgRouter.route("/addnew").post(orgController.addnew  );
orgRouter.route("/findone").post(orgController.findone  );
orgRouter.route("/traertodos").post(orgController.traertodos  );

module.exports = orgRouter;