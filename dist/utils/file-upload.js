"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const default_1 = require("../consts/default");
const error_1 = __importDefault(require("../types/error"));
const FILE_FORMATS = ['image/png', 'image/jpg', 'image/jpeg'];
const fileFilter = (request, file, callback) => {
    if (FILE_FORMATS.includes(file.mimetype)) {
        callback(null, true);
    }
    else {
        const error = new error_1.default(`The file format should be one of: ${FILE_FORMATS.join(', ')}`, 400);
        callback(error);
    }
};
const storage = multer_1.default.diskStorage({
    destination: (request, file, callback) => {
        const dirPath = path_1.default.resolve(default_1.DIR_UPLOADS_NAME);
        if (!fs_1.default.existsSync(dirPath)) {
            fs_1.default.mkdirSync(dirPath);
        }
        callback(null, dirPath);
    },
    filename: (req, file, callback) => {
        callback(null, `${Date.now()}-${file.fieldname}-${file.originalname}`);
    },
});
exports.default = (0, multer_1.default)({ storage, fileFilter });
