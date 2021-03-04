const express = require("express");
const logger = require("morgan");
var bodyParser = require("body-parser");
var cors = require('cors')
require('dotenv').config();

const app = express();

app.use(logger("dev"));
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())

const connectOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    keepAlive: true,
    useCreateIndex: true
};

const db = require('./models');

db.mongoose
  .connect(process.env.MONGO_URI, connectOptions)
  .then(() => {
    console.log('Successfully connect to MongoDB.');
  })
  .catch((err) => {
    console.error('Connection error', err);
    process.exit();
});

const shortRoutes = require('./routes/shortRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

app.use('', [shortRoutes, analyticsRoutes]);

app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on Port: " + (process.env.PORT || 3000));
});
