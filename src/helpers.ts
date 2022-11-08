import db from "./app/models/index";
import fs from "fs";
import path, { dirname } from "path";;

const Temperature = db.temperatures;
const Precipitation = db.precipitations;

const rootDir = path.resolve('./');

export const PopulateTemperatureCollection = () =>
    Temperature
        .find().skip(0).limit(1)
        .then((data: any) => {
            if (data.length == 0) {
                const filePath = path.join(rootDir, '/data/temperature.json');
                const temperatureRawJsonData = fs.readFileSync(filePath);
                const temperatureData = JSON.parse(temperatureRawJsonData.toString());
                for (let i in temperatureData) {
                    // Create a temperature
                    const temperature = new Temperature({
                        t: new Date(temperatureData[i].t),
                        v: temperatureData[i].v,
                    });

                    // Save temperature in the database
                    temperature
                        .save(temperature)
                        .catch((err: any) => {
                            console.log("Some error occurred while creating a Temperature record.", err);
                        });
                }

                console.log("Populated Precipitation table!");

                return;
            }
        })
        .catch((err: any) => {
            console.log("Some error occurred while retrieving Temperatures.", err);
        });

export const PopulatePrecipitationCollection = () =>
    Precipitation
        .find().skip(0).limit(1)
        .then((data: any) => {
            if (data.length == 0) {
                const filePath = path.join(rootDir, '/data/precipitation.json');
                const precipitationRawJsonData = fs.readFileSync(filePath);
                const precipitationData = JSON.parse(precipitationRawJsonData.toString());
                for (let i in precipitationData) {
                    // Create a Precipitation
                    const precipitation = new Precipitation({
                        t: new Date(precipitationData[i].t),
                        v: precipitationData[i].v,
                    });

                    // Save Precipitation in the database
                    precipitation
                        .save(precipitation)
                        .catch((err: any) => {
                            console.log("Some error occurred while creating a Precipitation record.", err);
                        });
                }

                console.log("Populated Precipitation table!");

                return;
            }
        })
        .catch((err: any) => {
            console.log("Some error occurred while retrieving Precipitations.", err);
        });