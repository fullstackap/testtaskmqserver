import { Request, Response } from 'express';
import fs from "fs";
import path, { dirname } from "path";
import db from "../models";

const LIMIT_RECORDS = 50;

const Temperature = db.temperatures;

class TemperatureController {
    // Get all Temperatures from the database.
    getAll(req: Request, res: Response) {
        const offset: any = req.query.offset;
        const limit: any = req.query.limit;

        const finalOffset = offset >= 0 ? offset : 0;
        const finalLimit = limit > 0 ? limit : LIMIT_RECORDS;

        Temperature.count({}, (err, count) => {
            if (err) {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while counting Temperatures."
                });

                return;
            }

            if (count == 0) {
                res.send({
                    items: [],
                    offset: finalOffset,
                    limit: finalLimit,
                    count,
                });
                
                return;
            }

            Temperature.find().skip(finalOffset).limit(finalLimit)
                .then((data: any) => {
                    res.send({
                        items: data,
                        offset: finalOffset,
                        limit: finalLimit,
                        count,
                    });
                })
                .catch((err: any) => {
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while retrieving Temperatures."
                    });
                });
        });
    };

    // Get a single Temperature with an id
    getOne(req: Request, res: Response) {
        const id = req.params.id;

        // Validate request
        if (!id) {
            res.status(400).send({ message: "id can not be empty!" });
            return;
        }

        Temperature.findById(id)
            .then((data: any) => {
                if (!data)
                    res.status(404).send({ message: "Not found Temperature with id " + id });
                else res.send(data);
            })
            .catch((err: any) => {
                res
                    .status(500)
                    .send({ message: "Error retrieving Temperature with id=" + id });
            });
    };

    // Create and Save a new Temperature
    create(req: Request, res: Response) {
        // Validate request
        if (!req.body.itemData || req.body.itemData.length == 0) {
            res.status(400).send({ message: "itemData can not be empty!" });
            return;
        }

        for (let i in req.body.itemData) {
            if (!req.body.itemData[i].t) {
                res.status(400).send({ message: `Date at index ${i} cannot be empty!` });
                return;
            }

            if (!req.body.itemData[i].v) {
                res.status(400).send({ message: `Temperature value at index ${i} can not be empty!` });
                return;
            }
        }

        for (let i in req.body.itemData) {
            // Create a Temperature
            const temperature = new Temperature({
                t: new Date(req.body.itemData[i].t),
                v: req.body.itemData[i].v,
            });

            // Save Temperature in the database
            temperature
                .save(temperature)
                .then((data: any) => {
                    res.send(data);
                })
                .catch((err: any) => {
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while creating a Temperature record."
                    });
                });
        }
    };

    // Update a Temperature by the id in the request
    update(req: Request, res: Response) {
        if (!req.body) {
            return res.status(400).send({
                message: "Data to update can not be empty!"
            });
        }

        const id = req.params.id;

        // Validate request
        if (!id) {
            res.status(400).send({ message: "id can not be empty!" });
            return;
        }

        Temperature.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
            .then((data: any) => {
                if (!data) {
                    res.status(404).send({
                        message: `Cannot update Temperature with id=${id}. Maybe Temperature was not found!`
                    });
                } else res.send({ message: "Temperature was updated successfully." });
            })
            .catch((err: any) => {
                res.status(500).send({
                    message: "Error updating Temperature with id=" + id
                });
            });
    };

    // Delete a Temperature with the specified id in the request
    deleteT(req: Request, res: Response) {
        const id = req.params.id;

        // Validate request
        if (!id) {
            res.status(400).send({ message: "id can not be empty!" });
            return;
        }

        Temperature.findByIdAndRemove(id, { useFindAndModify: false })
            .then((data: any) => {
                if (!data) {
                    res.status(404).send({
                        message: `Cannot delete Temperature with id=${id}. Maybe Temperature was not found!`
                    });
                } else {
                    res.send({
                        message: "Temperature was deleted successfully!"
                    });
                }
            })
            .catch((err: any) => {
                res.status(500).send({
                    message: "Could not delete Temperature with id=" + id
                });
            });
    };

    // Delete all Temperatures from the database.
    deleteAll(req: Request, res: Response) {
        Temperature.deleteMany({})
            .then((data: any) => {
                res.send({
                    message: `${data.deletedCount} Temperatures were deleted successfully!`
                });
            })
            .catch((err: any) => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while deleting all temperatures."
                });
            });
    };
};

export default TemperatureController;