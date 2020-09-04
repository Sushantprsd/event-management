const mongoose = require("mongoose");
const fileHelper = require("../util/file");
const Event = require("../model/Events");
const Enrolled = require("../model/Enrolled");

exports.postNewEvent = (req, res, next) => {
    const name = req.body.name;
    const time = req.body.time;
    const date = req.body.date;
    const state = req.body.state;
    const city = req.body.city;
    const description = req.body.description;
    let imageUrl = null;
    try {
        imageUrl = req.file.path;
    } catch (err) {
        if (imageUrl) {
            fileHelper.deleteFile(imageUrl);
        }
        next(err)
    }
    let path = imageUrl.split("/").pop();
    // console.log(typeof(path))
    // path = path.replace(/\s/g, "%")

    console.log(path);
    const newEvent = new Event({
        public: {
            name: name,
            date: date,
            time: time,
            location: {
                state: state,
                city: city,
                landmark: "ground",
                coordinates: {
                    type: "Point",
                    coordinates: [0,0],
                },
            },
            description: description,
            organizerName: req.user.public.name,
            imageUrl: path,
        },
        userId: req.userId,
    });
    newEvent
        .save()
        .then((newEvent) => {
            res.json({
                newEvent,
            });
        })
        .catch((err) => {
            if(imageUrl){
                fileHelper.deleteFile(imageUrl);
            }
            if (!err.statusCode) {
                err.statusCode = 500;
                next(err);
            }
            next(err);
        });
};

exports.getFetchAllUserEvent = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 10;
    Event.aggregate([
        { $skip: (currentPage - 1) * perPage },
        { $limit: perPage },
        {
            $project: {
                _id: 1,
                public: 1,
            },
            $project: {
                "public.description": 0,
            },
        },
    ])
        .then((result) => {
            res.json({
                result,
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

exports.postDeleteUserEvent = (req, res, next) => {
    const eventId = req.params.eventId;
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        const error = new Error("Event Doesn't Exist");
        error.statusCode = 404;
        throw error;
    }
    Event.findById(eventId, { _id: 1, userId: 1 })
        .then((event) => {
            if (!event) {
                const error = new Error("Event Doesn't Exist");
                error.statusCode = 404;
                throw error;
            }
            if (event.userId.toString() !== req.userId.toString()) {
                const error = new Error("Not Found");
                error.statusCode = 404;
                throw error;
            }
            return Event.deleteOne({ _id: eventId });
        })
        .then((data) => {
            return res.status(204).json({
                message: "Event Deleted",
            });
        })
        .catch((err) => {
            console.log(err);
            if (!err.statusCode) {
                err.statusCode = 500;
                next(err);
            }
            next(err);
        });
};

exports.getUserEvent = (req, res, next) => {
    const eventId = req.params.eventId;
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        const error = new Error("Event Doesn't Exist");
        error.statusCode = 404;
        throw error;
    }
    Event.findById(eventId)
        .then((event) => {
            if (!event) {
                const error = new Error("Event Doesn't Exist");
                error.statusCode = 404;
                throw error;
            }
            if (event.userId.toString() !== req.userId.toString()) {
                const error = new Error("Not Found");
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({
                data: event,
            });
        })
        .catch((err) => {
            console.log(err);
            if (!err.statusCode) {
                err.statusCode = 500;
                next(err);
            }
            next(err);
        });
};

exports.postEnrollToEvent = (req, res, next) => {
    const eventId = req.params.eventId;
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        const error = new Error("Event Doesn't Exist");
        error.statusCode = 404;
        throw error;
    }
    let alreadyEnrolled = false;
    let enrolledEvent = null;
    Enrolled.findOne({ eventId: eventId, userId: req.userId })
        .then((event) => {
            if (event) {
                alreadyEnrolled = true;
            } else {
                const enrolledEvent = new Enrolled({
                    eventId: eventId,
                    userId: req.userId,
                });
                return enrolledEvent.save();
            }
        })
        .then((enrolledEvent) => {
            if (alreadyEnrolled) {
                return res.status(200).json({
                    message: "Already Enrolled",
                    data: enrolledEvent,
                });
            } else {
                return res.status(201).json({
                    message: "Enrolled In The Event",
                    data: enrolledEvent,
                });
            }
        })
        .catch((err) => {
            console.log(err);
            if (!err.statusCode) {
                err.statusCode = 500;
                next(err);
            }
            next(err);
        });
};

// exports.postUpdateEvent = (req, res, next) => {
//     const eventId = req.params.eventId;
//     if (!mongoose.Types.ObjectId.isValid(eventId)) {
//         const error = new Error("Event Doesn't Exist");
//         error.statusCode = 404;
//         throw error;
//     }
//     Event.findById(eventId)
//         .then((event) => {
//             if (!event) {
//                 const error = new Error("Event Doesn't Exist");
//                 error.statusCode = 404;
//                 throw error;
//             }
//             if (event.userId.toString() !== req.userId.toString()) {
//                 const error = new Error("Not Found");
//                 error.statusCode = 404;
//                 throw error;
//             }

//         })
//         .catch((err) => {
//             console.log(err);
//             if (!err.statusCode) {
//                 err.statusCode = 500;
//                 next(err);
//             }
//             next(err);
//         });
// };
