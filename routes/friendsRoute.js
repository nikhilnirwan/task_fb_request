const express = require("express");
const friendsController = require("../controllers/friendsController");
const router = express.Router();
router.get("/friends", friendsController.getAllFriends);
router.post("/friend", friendsController.sendRequest);
router.put("/friends-request/:id", friendsController.receiveRequest);
router.get("/friends-request", friendsController.getAllFriendRequest);

module.exports = router;
