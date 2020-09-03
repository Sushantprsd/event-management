const express = require("express");
const router = express.Router();
const eventController = require("../controller/event");

router.get("/all",eventController.getFetchAllEvent);
router.get("/filter",eventController.getFilteredEvent);
module.exports = router;
