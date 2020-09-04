var mongoose = require("mongoose");
const Event = require("../model/Events");

exports.getFetchAllEvent = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 10;
    Event.aggregate([
        {
            $sort: {
                created_at: -1,
            },
        },
        { $skip: (currentPage - 1) * perPage },
        { $limit: perPage },
        {
            $project: {
                "public.name": 1,
                "public.date": 1,
                "public.time": 1,
                "public.location.state": 1,
                "public.organizerName": 1,
                "public.imageUrl":1,
                "public.description":1,
                created_at: 1,
            },
        },
    ])
        .then((data) => {
            res.json({
                data,
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
                next(err);
            }
            next(err);
        });
};

exports.getFilteredEvent = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 10;
    const state = req.body.state;
    Event.aggregate([
        {
            $match: {
                $and: [{ "public.location.state": state }],
            },
        },
        {
            $sort: {
                created_at: -1,
            },
        },
        { $skip: (currentPage - 1) * perPage },
        { $limit: perPage },
        {
            $project: {
                "public.name": 1,
                "public.date": 1,
                "public.time": 1,
                "public.location.state": 1,
                "public.organizer.name": 1,
                created_at: 1,
            },
        },
    ])
        .then((data) => {
            res.json({
                data,
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
                next(err);
            }
            next(err);
        });
};
