const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/isAuth");
const multerHelper = require("../middleware/multer/multerHelper");
const userController = require("../controller/user");

router.post("/event/add", isAuth, multerHelper.uploadImage, userController.postNewEvent);
router.get("/event/all", isAuth, userController.getFetchAllUserEvent);
router.post("/event/delete/:eventId", isAuth, userController.postDeleteUserEvent);
router.get("/event/:eventId", isAuth, userController.getUserEvent);
router.post("/event/book/:eventId", isAuth, userController.postEnrollToEvent);
router.get("/event/enrolled/all", isAuth, userController.getEnrolledEvent);
router.get("/event/enrolled/:eventId", isAuth, userController.isEnrolled);



module.exports = router;
