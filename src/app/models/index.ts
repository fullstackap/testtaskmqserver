
import dbConfig from "../config/db.config.js";
import mongoose from "mongoose";
import temperature from "./temperature.model.js";
import precipitation from "./precipitation.model.js";

mongoose.Promise = global.Promise;

const db = {
    mongoose,
    url: dbConfig.url,
    temperatures: temperature(mongoose),
    precipitations: precipitation(mongoose),
};

export default db;