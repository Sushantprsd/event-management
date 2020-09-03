const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/isAuth");
const userController = require("../controller/user");

router.post("/event/add", isAuth, userController.postNewEvent);
router.get("/event/all", isAuth, userController.getFetchAllUserEvent);
router.post("/event/delete/:eventId", isAuth, userController.postDeleteUserEvent);
router.get("/event/:eventId", isAuth, userController.getUserEvent);
router.post("/event/book/:eventId",isAuth,userController.postEnrollToEvent)
module.exports = router;
