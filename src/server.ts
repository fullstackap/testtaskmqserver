import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import db from "./serverback/models/index";
import temperatureRouter from "./serverback/routes/temperature.routes";
import precipitationRouter from "./serverback/routes/precipitation.routes";
import dotenv from "dotenv";

dotenv.config();

const corsOptions = {
  origin: "http://localhost:5000/"
};

const app = express();

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/weather-archive-service/temperature/", temperatureRouter());
app.use("/api/weather-archive-service/precipitation/", precipitationRouter());

// setup mongo db
db.mongoose
  .connect(db.url, {
    dbName: "testtaskmq_db",
    autoIndex: true,
    autoCreate: true,
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err:any) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });
// set port, listen for requests
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});