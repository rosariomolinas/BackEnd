const express = require("express");
const usuController = require("../controllers/usuController");
const usuRouter = express.Router();
usuRouter.route("/validar").post(usuController.validar  );
usuRouter.route("/logout").post(usuController.logout  );
usuRouter.route("/datos").post(usuController.datos  );
usuRouter.route("/pwdUpdate").post(usuController.pwdUpdate  );



module.exports = usuRouter;