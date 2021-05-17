require("dotenv").config({ path: ".env.dev" });
const express = require("express");
const routes = require("./routes/api");
const mongoose = require("mongoose");
const cors = require("cors");
const port = process.env.PORT || 5000;

// * express app
const app = express();

//Init Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.options((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-REquested-with,Authorization"
  );
  res.header("Access-Control-Allow-Origin", "PUT,POST,PATCH,DELETE,GET");
  res.status(200).json({});
});

app.use(require("morgan")("dev"));

app.get("/", (req, res, next) => {
  res.status(200).json({ message: "Backend is live" });
});
//Define Routes
app.use("/api/users", routes.userRoutes);
app.use("/api/posts", routes.postRoutes);
app.use("/api/profile", routes.profileRoutes);
app.use("/api/auth", routes.authRoutes);

app.use("*", (req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

//Connect Database
mongoose
  .connect(process.env.DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connected to MongoDB"));

app.listen(port, () => {
  console.log(`Server Listening on http://localhost: ${port}`);
});
