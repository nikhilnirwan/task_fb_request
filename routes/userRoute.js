const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

router.post("/resister", userController.userRegister);
router.post("/login", userController.loginUser);

module.exports = router;
