const fs = require("fs");
const catchAsync = require("../helper/catchAsync");

require("dotenv").config("config.env");

const friends = "friends.json";
let friendDetail = require(`../${friends}`);

function saveData() {
  fs.writeFileSync(friends, JSON.stringify(friendDetail, null, 2));
}

exports.getAllFriends = catchAsync(async (req, res) => {
  const page = parseInt(req.body.page) || 1;
  const limit = parseInt(req.body.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const friends = friendDetail.friends.slice(startIndex, endIndex);
  res.status(200).json(friends);
});

exports.sendRequest = catchAsync(async (req, res) => {
  let body = req.body;

  const requestDetails = {
    senderId: body.senderId,
    receiverId: body.receiverId,
  };
  requestDetails.id = Math.floor(Math.random() * 100000 + 1);

  friendDetail.friends.push(requestDetails);
  saveData();
  res.status(201).json("You send friend request.");
});

exports.receiveRequest = catchAsync(async (req, res) => {
  let id = req.params.id;
  const body = req.body;

  const requestDetail = await friendDetail.friends.find((ele) => ele.id == id);

  const requestDetails = {
    senderId: requestDetail.senderId,
    receiverId: requestDetail.receiverId,
    isAccept: body.isAccept,
    id: id, //isAccept = true ,isAccept = false reject
  };
  const requestIndex = friendDetail.friends.findIndex((i) => i.id == id);
  if (requestIndex === -1) {
    res.status(404).send("Request not found.");
  } else {
    friendDetail.friends[requestIndex] = requestDetails;
    saveData();
    const status = body.isAccept == true ? "accept" : "reject";
    res.status(201).json(`You ${status} friend request.`);
  }
});

exports.getAllFriendRequest = catchAsync(async (req, res) => {
  const page = parseInt(req.body.page) || 1;
  const limit = parseInt(req.body.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  let friends = friendDetail.friends.slice(startIndex, endIndex);

  friends = friends.filter((friend) => {
    return friend.isAccept == null;
  });
  res.status(200).json(friends);
});
