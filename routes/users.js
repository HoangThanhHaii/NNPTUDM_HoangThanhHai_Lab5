var express = require("express");
var router = express.Router();
const User = require("../model/user");


// CREATE USER
// POST /api/v1/users
router.post("/", async function (req, res) {

  try {

    const user = new User({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      fullName: req.body.fullName,
      role: req.body.role
    });

    await user.save();

    res.json({
      success: true,
      data: user
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

});


// GET ALL USERS
// /api/v1/users?username=kai
router.get("/", async function (req, res) {

  try {

    const username = req.query.username;

    let filter = {};

    if (username) {
      filter.username = { $regex: username, $options: "i" };
    }

    const users = await User.find(filter).populate("role");

    res.json({
      success: true,
      data: users
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

});


// GET USER BY ID
router.get("/:id", async function (req, res) {

  try {

    const user = await User.findById(req.params.id).populate("role");

    res.json({
      success: true,
      data: user
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

});


// UPDATE USER
router.put("/:id", async function (req, res) {

  try {

    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      data: user
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

});


// SOFT DELETE USER
router.delete("/:id", async function (req, res) {

  try {

    await User.findByIdAndUpdate(req.params.id, {
      isDeleted: true
    });

    res.json({
      success: true,
      message: "User deleted"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

});


// ENABLE USER
router.post("/enable", async function (req, res) {

  try {

    const { email, username } = req.body;

    const user = await User.findOneAndUpdate(
      { email, username },
      { status: true },
      { new: true }
    );

    res.json({
      success: true,
      data: user
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

});


// DISABLE USER
router.post("/disable", async function (req, res) {

  try {

    const { email, username } = req.body;

    const user = await User.findOneAndUpdate(
      { email, username },
      { status: false },
      { new: true }
    );

    res.json({
      success: true,
      data: user
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

});

module.exports = router;