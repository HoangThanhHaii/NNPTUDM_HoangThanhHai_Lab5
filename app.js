var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var app = express();

// ================== VIEW ENGINE ==================
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// ================== MIDDLEWARE ==================
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// ================== DATABASE ==================
mongoose.connect("mongodb://127.0.0.1:27017/NNPTUD-S4");

mongoose.connection.on("connected", function () {
  console.log("MongoDB connected");
});

mongoose.connection.on("error", function (err) {
  console.log("MongoDB error:", err);
});

mongoose.connection.on("disconnected", function () {
  console.log("MongoDB disconnected");
});

// ================== ROUTES ==================
const rolesRouter = require("./routes/roles");
const usersRouter = require("./routes/users");
const productsRouter = require("./routes/products");
const categoriesRouter = require("./routes/categories");

app.use("/api/v1/roles", rolesRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/categories", categoriesRouter);

// ================== 404 HANDLER ==================
app.use(function (req, res, next) {
  next(createError(404));
});

// ================== ERROR HANDLER ==================
app.use(function (err, req, res, next) {

  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);

  res.json({
    success: false,
    message: err.message
  });

});

module.exports = app;