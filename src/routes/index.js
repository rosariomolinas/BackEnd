const { Router: expressRouter } = require("express");
const router = expressRouter();
// auth routes

const pacRouter = require("./pacRoute");
const orgRouter = require("./orgRoute");
const medicaRouter = require("./medicaRoute");
const docRouter = require("./docRoute");
const usuRouter = require("./usuRoute");
const intervRoute = require("./intervRoute");


router.use("/pac", pacRouter);
router.use("/org", orgRouter);
router.use("/medica", medicaRouter);
router.use("/doctor", docRouter);
router.use("/usuarios", usuRouter);
router.use("/interv", intervRoute);

module.exports = router;