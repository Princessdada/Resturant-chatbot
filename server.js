const express = require("express");
const session = require("express-session");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const http = require("http");
dotenv.config();
const db = require("./config/db");
const menu = require("./menu");
db.connectToMongodb();
const app = express();
app.set('trust proxy', 1); // Trust first proxy (Render load balancer) enabling secure cookies
const server = http.createServer(app);
const PORT = process.env.PORT || 8000;
const sessionMiddleware = require("./config/session")
const chatRoute = require("./routes/chatRoute");
app.use(
  cors({
    origin: true, // Allow any origin that sends the request (mirrors Origin header)
    credentials: true,
  })
);

// create session
app.use(sessionMiddleware);

// Serve static files from frontend directory
app.use(express.static('frontend'));

// Parse JSON bodies
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use("/chat", chatRoute);
const paymentRoute = require("./routes/paymentRoute");
app.use("/payment", paymentRoute);


server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
