"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const companies_1 = require("../controllers/companies");
const payment_1 = require("../controllers/payment");
const auth_1 = __importDefault(require("../middleware/auth"));
const check_rights_1 = require("../middleware/check-rights");
const error_boundary_1 = __importDefault(require("../utils/error-boundary"));
const file_upload_1 = __importDefault(require("../utils/file-upload"));
const validation_1 = __importDefault(require("../utils/validation"));
const companies_2 = require("../validation/companies");
const router = express_1.default.Router();
router.get('/', (0, validation_1.default)(companies_2.getCompaniesSchema, 'query'), (0, error_boundary_1.default)(companies_1.getCompanies));
router.get('/:id', (0, error_boundary_1.default)(companies_1.getCompanyById));
router.use(auth_1.default);
router.post('/', (0, validation_1.default)(companies_2.createSchema), (0, error_boundary_1.default)(companies_1.createCompany));
router.put('/:id', check_rights_1.checkUserCompanyRights, (0, validation_1.default)(companies_2.updateSchema), (0, error_boundary_1.default)(companies_1.updateCompany));
router.delete('/:id', check_rights_1.checkUserCompanyRights, (0, error_boundary_1.default)(companies_1.deleteCompany));
router.put('/:id/avatar', check_rights_1.checkUserCompanyRights, file_upload_1.default.single('avatar'), (0, error_boundary_1.default)(companies_1.updateAvatar));
router.delete('/:id/avatar', check_rights_1.checkUserCompanyRights, (0, error_boundary_1.default)(companies_1.deleteAvatar));
router.post('/:id/stripe-account', (0, error_boundary_1.default)(payment_1.createAccount));
router.get('/:id/stripe-account', (0, error_boundary_1.default)(payment_1.getAccountLink));
exports.default = router;
