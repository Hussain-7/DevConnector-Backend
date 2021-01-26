const express = require("express");
const connectDB = require("./config/db");
const routes = require("./routes/api");
const app = express();

//Connect Database

connectDB();

//Init Middleware
app.use(express.json({ extended: false }));
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:3000/");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin,X-requested-With,Content-Type,Accept,Authorization"
//   );

//   if (req.method == "OPTIONS") {
//     res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
//     return res.status(200).json({});
//   }
//   next();
// });

app.get("/", (req, res) => res.send("API Running"));

//Define Routes
app.use("/api/users", routes.userRoutes);
app.use("/api/posts", routes.postRoutes);
app.use("/api/profile", routes.profileRoutes);
app.use("/api/auth", routes.authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
