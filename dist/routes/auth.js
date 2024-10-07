"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controllers/auth");
const validation_1 = __importDefault(require("../utils/validation"));
const user_1 = require("../validation/user");
const error_boundary_1 = __importDefault(require("../utils/error-boundary"));
const router = express_1.default.Router();
router.post('/register', (0, validation_1.default)(user_1.registerSchema), (0, error_boundary_1.default)(auth_1.register));
router.post('/login', (0, validation_1.default)(user_1.loginSchema), (0, error_boundary_1.default)(auth_1.login));
router.post('/refresh', (0, error_boundary_1.default)(auth_1.refresh));
router.post('/logout', (0, error_boundary_1.default)(auth_1.logout));
router.post('/confirm-email/:token', (0, error_boundary_1.default)(auth_1.confirmEmail));
router.post('/password-reset', (0, validation_1.default)(user_1.sendPasswordConfirmationSchema), (0, error_boundary_1.default)(auth_1.sendPasswordConfirmation));
router.post('/password-reset/:token', (0, validation_1.default)(user_1.resetPasswordSchema), (0, error_boundary_1.default)(auth_1.resetPassword));
exports.default = router;
