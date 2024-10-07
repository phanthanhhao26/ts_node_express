"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const profile_1 = require("../controllers/profile");
const users_1 = require("../controllers/users");
const admin_auth_1 = __importDefault(require("../middleware/admin-auth"));
const auth_1 = __importStar(require("../middleware/auth"));
const error_boundary_1 = __importDefault(require("../utils/error-boundary"));
const validation_1 = __importDefault(require("../utils/validation"));
const user_1 = require("../validation/user");
const router = express_1.default.Router();
router.get('/:id', (0, error_boundary_1.default)(users_1.getUser));
router.get('/', auth_1.optionalAuth, (0, error_boundary_1.default)(users_1.getMany));
router.use(auth_1.default, admin_auth_1.default);
router.post('/', (0, validation_1.default)(user_1.createSchema), (0, error_boundary_1.default)(users_1.createUser));
router.put('/:id', (0, validation_1.default)(user_1.adminUpdateSchema), (0, error_boundary_1.default)(users_1.updateUser));
router.delete('/:id', (0, error_boundary_1.default)(users_1.deleteUser));
router.put('/:id/avatar', (0, error_boundary_1.default)(profile_1.uploadPhoto), (0, error_boundary_1.default)(users_1.updateUserAvatar));
router.delete('/:id/avatar', (0, error_boundary_1.default)(users_1.deleteUserAvatar));
exports.default = router;
