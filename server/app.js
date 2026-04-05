var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
var cronScheduler = require("./utils/cronScheduler");

var authRouter = require("./routes/auth");
var pinRouter = require("./routes/pin");
var webAuthnRouter = require("./routes/webauthn");
var docRouter = require("./routes/document");
var groupRouter = require("./routes/group");
var groupMemberRouter = require("./routes/groupMember");
var groupDependentRouter = require("./routes/groupDependent");

var app = express();

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
  next();
});

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:5173",
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://192.168.0.43:5173",
    ],
    credentials: true,
  }),
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// API routes
app.use("/auth", authRouter);
app.use("/auth", pinRouter);
app.use("/auth", webAuthnRouter);
app.use("/docs", docRouter);
app.use("/groups", groupRouter);
app.use("/groups", groupMemberRouter);
app.use("/groups", groupDependentRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message =
    process.env.NODE_ENV === "development"
      ? err.message
      : "Internal server error";
  res.status(status).json({ message });
});

module.exports = app;
