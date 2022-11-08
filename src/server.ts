import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import db from "./app/models/index";
import temperatureRouter from "./app/routes/temperature.routes";
import precipitationRouter from "./app/routes/precipitation.routes";
import dotenv from "dotenv";
import { PopulateTemperatureCollection, PopulatePrecipitationCollection } from "./helpers";

dotenv.config();

const corsOptions = {
  origin: "*",

  methods: [
    'GET', 'POST', 'PUT', 'DELETE'
  ],

  allowedHeaders: [
    'Content-Type',
  ],
};

const app = express();

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// add routes
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
    PopulateTemperatureCollection();
    PopulatePrecipitationCollection();
  })
  .catch((err: any) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });
// set port, listen for requests
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});