const express = require("express");
var router = express.Router();

var signup_controller = require("../controllers/signupcontroller");

router.get("/",signup_controller.index);

module.exports = router;
