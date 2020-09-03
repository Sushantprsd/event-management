const multer = require("multer");

var fileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

exports.uploadImage = multer({ storage: fileStorage, fileFilter: fileFilter }).single("image");

// exports.profilePhotoUpload = multer({
//     storage: multerS3({
//         s3: s3,
//         bucket: profileBucket,
//         acl: "public-read",
//         key: function (req, file, cb) {
//             cb(null, Date.now() + "-" + file.originalname);
//         },
//     }),
//     fileFilter: profileFilter,
// }).single("image");

// exports.newVideoUpload = multer({
//     storage: multerS3({
//         s3: s3,
//         bucket: videoBucket,
//         acl: "public-read",
//         key: function (req, file, cb) {
//             cb(null, Date.now() + "-" + file.originalname);
//         },
//     }),
//     fileFilter: videosFilter,
// }).single("videoFile");
