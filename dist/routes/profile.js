"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const profile_1 = require("../controllers/profile");
const auth_1 = __importDefault(require("../middleware/auth"));
const error_boundary_1 = __importDefault(require("../utils/error-boundary"));
const validation_1 = __importDefault(require("../utils/validation"));
const user_1 = require("../validation/user");
const router = express_1.default.Router();
router.use(auth_1.default);
router.get('/', (0, error_boundary_1.default)(profile_1.getProfile));
router.put('/avatar', (0, error_boundary_1.default)(profile_1.uploadPhoto), (0, error_boundary_1.default)(profile_1.updateUserAvatar));
router.delete('/avatar', (0, error_boundary_1.default)(profile_1.deleteUserAvatar));
router.put('/', (0, validation_1.default)(user_1.updateSchema), (0, error_boundary_1.default)(profile_1.updateProfile));
router.delete('/', (0, error_boundary_1.default)(profile_1.deleteProfile));
exports.default = router;
