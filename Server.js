const express = require("express");
const connectDB = require("./config/db");
const connectDb = require("./config/db");
const routes = require("./routes/api");
const app = express();

//Connect Database

connectDB();

//Init Middleware
app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("API Running"));

//Define Routes
app.use("/api/users", routes.userRoutes);
app.use("/api/posts", routes.postsRoutes);
app.use("/api/profile", routes.profileRoutes);
app.use("/api/auth", routes.authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
