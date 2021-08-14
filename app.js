const express = require("express");
const logger = require("morgan");
var cors = require("cors");
require("dotenv").config();

const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(logger("dev"));
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const connectOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    keepAlive: true,
    useCreateIndex: true,
};

const db = require("./models");

db.mongoose
    .connect(process.env.MONGO_URI, connectOptions)
    .then(() => {
        console.log("Successfully connect to MongoDB.");
    })
    .catch((err) => {
        console.error("Connection error", err);
        process.exit();
    });

const shortRoutes = require("./routes/shortRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

app.use("", [shortRoutes, analyticsRoutes]);

io.path("/test");

io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});

app.listen(process.env.PORT || 3001, function () {
    console.log("Server is running on Port: " + (process.env.PORT || 3001));
});
