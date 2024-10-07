"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_companies_1 = require("../controllers/user-companies");
const auth_1 = __importDefault(require("../middleware/auth"));
const error_boundary_1 = __importDefault(require("../utils/error-boundary"));
const router = express_1.default.Router();
router.use(auth_1.default);
router.post('/:id', (0, error_boundary_1.default)(user_companies_1.subscribeToCompany));
router.delete('/:id', (0, error_boundary_1.default)(user_companies_1.unsubscribeFromCompany));
exports.default = router;
