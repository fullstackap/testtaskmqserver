import { Request, Response } from 'express';
import fs from "fs";
import path, { dirname } from "path";
import db from "../models";

const LIMIT_RECORDS = 50;

const Precipitation = db.precipitations;

class PrecipitationController {
    // Get all Precipitations from the database.
    getAll(req: Request, res: Response) {
        const offset: any = req.query.offset;
        const limit: any = req.query.limit;

        const finalOffset = offset >= 0 ? offset : 0;
        const finalLimit = limit > 0 ? limit : LIMIT_RECORDS;

        Precipitation.count({}, (err, count) => {
            if (err) {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while counting Precipitations."
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

            Precipitation.find().skip(finalOffset).limit(finalLimit)
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
                            err.message || "Some error occurred while retrieving Precipitations."
                    });
                });
        });
    };

    // Get a single Precipitation with an id
    getOne(req: Request, res: Response) {
        const id = req.params.id;

        // Validate request
        if (!id) {
            res.status(400).send({ message: "id can not be empty!" });
            return;
        }

        Precipitation.findById(id)
            .then((data: any) => {
                if (!data)
                    res.status(404).send({ message: "Not found Precipitation with id " + id });
                else res.send(data);
            })
            .catch((err: any) => {
                res
                    .status(500)
                    .send({ message: "Error retrieving Precipitation with id=" + id });
            });
    };

    // Create and Save a new Precipitation
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
                res.status(400).send({ message: `Precipitation value at index ${i} can not be empty!` });
                return;
            }
        }

        for (let i in req.body.itemData) {
            // Create a Precipitation
            const precipitation = new Precipitation({
                t: new Date(req.body.itemData[i].t),
                v: req.body.itemData[i].v,
            });

            // Save Precipitation in the database
            precipitation
                .save(precipitation)
                .then((data: any) => {
                    res.send(data);
                })
                .catch((err: any) => {
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while creating a Precipitation record."
                    });
                });
        }
    };

    // Update a Precipitation by the id in the request
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

        Precipitation.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
            .then((data: any) => {
                if (!data) {
                    res.status(404).send({
                        message: `Cannot update Precipitation with id=${id}. Maybe Precipitation was not found!`
                    });
                } else res.send({ message: "Precipitation was updated successfully." });
            })
            .catch((err: any) => {
                res.status(500).send({
                    message: "Error updating Precipitation with id=" + id
                });
            });
    };

    // Delete a Precipitation with the specified id in the request
    deleteP(req: Request, res: Response) {
        const id = req.params.id;

        // Validate request
        if (!id) {
            res.status(400).send({ message: "id can not be empty!" });
            return;
        }

        Precipitation.findByIdAndRemove(id, { useFindAndModify: false })
            .then((data: any) => {
                if (!data) {
                    res.status(404).send({
                        message: `Cannot delete Precipitation with id=${id}. Maybe Precipitation was not found!`
                    });
                } else {
                    res.send({
                        message: "Precipitation was deleted successfully!"
                    });
                }
            })
            .catch((err: any) => {
                res.status(500).send({
                    message: "Could not delete Precipitation with id=" + id
                });
            });
    };

    // Delete all Precipitations from the database.
    deleteAll(req: Request, res: Response) {
        Precipitation.deleteMany({})
            .then((data: any) => {
                res.send({
                    message: `${data.deletedCount} Precipitations were deleted successfully!`
                });
            })
            .catch((err: any) => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while deleting all Precipitations."
                });
            });
    };
};

export default PrecipitationController;