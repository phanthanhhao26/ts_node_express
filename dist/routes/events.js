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
const events_1 = require("../controllers/events");
const payment_1 = require("../controllers/payment");
const auth_1 = __importStar(require("../middleware/auth"));
const check_rights_1 = require("../middleware/check-rights");
const error_boundary_1 = __importDefault(require("../utils/error-boundary"));
const file_upload_1 = __importDefault(require("../utils/file-upload"));
const validation_1 = __importDefault(require("../utils/validation"));
const events_2 = require("../validation/events");
const router = express_1.default.Router();
router.get('/', auth_1.optionalAuth, (0, error_boundary_1.default)(events_1.getManyEvents));
router.get('/:id', (0, error_boundary_1.default)(events_1.getOneEventById));
router.use(auth_1.default);
router.post('/', (0, validation_1.default)(events_2.createSchema), check_rights_1.checkUserCompanyRights, (0, error_boundary_1.default)(events_1.createEvent));
router.put('/:id', check_rights_1.checkUserEventRights, (0, validation_1.default)(events_2.updateSchema), (0, error_boundary_1.default)(events_1.updateEvent));
router.delete('/:id', check_rights_1.checkUserEventRights, (0, error_boundary_1.default)(events_1.deleteEvent));
router.put('/:id/poster', check_rights_1.checkUserEventRights, file_upload_1.default.single('poster'), (0, error_boundary_1.default)(events_1.updatePoster));
router.delete('/:id/poster', check_rights_1.checkUserEventRights, (0, error_boundary_1.default)(events_1.deletePoster));
router.post('/:id/subscribe', (0, validation_1.default)(events_2.ticketSchema), (0, error_boundary_1.default)(payment_1.createSession));
exports.default = router;
