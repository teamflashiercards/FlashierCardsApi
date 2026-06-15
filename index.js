import express from "express";
import "dotenv/config";
import profileRouter from "./routes/profile.routes.js";

const app = express();
const port = 3000;

// middleware
app.use(express.json());

// mount routers
app.use("/api/profile", profileRouter); 

// start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});