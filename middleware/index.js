const isAuth = require("./is-auth");
const isAdmin = require("./is-admin");
const upload = require("./multer");
const uploadImage = require("./upload-image");

module.exports = [isAuth, isAdmin, upload.single("file")];
