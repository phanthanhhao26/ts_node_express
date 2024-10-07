"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const logger_1 = __importDefault(require("../lib/logger"));
const routes_1 = __importDefault(require("../routes"));
const error_1 = __importDefault(require("../middleware/error"));
const default_1 = require("../consts/default");
const admin_1 = __importDefault(require("../services/admin"));
const swagger_1 = __importDefault(require("../swagger"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const payment_1 = require("../controllers/payment");
const error_boundary_1 = __importDefault(require("../utils/error-boundary"));
const initializeApp = () => {
    const app = (0, express_1.default)();
    app.post('/webhook', express_1.default.raw({ type: 'application/json' }), (0, error_boundary_1.default)(payment_1.stripeWebhook));
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, cookie_parser_1.default)());
    app.use((0, cors_1.default)({
        origin: [process.env.CLIENT_URL, process.env.ADMIN_URL],
        credentials: true,
        methods: 'GET, POST, PUT, PATCH, DELETE',
        allowedHeaders: 'Content-Type, Authorization, Set-Cookie',
        exposedHeaders: 'X-Total-Count',
    }));
    app.use(routes_1.default);
    app.use(error_1.default);
    app.use(express_1.default.static(default_1.DIR_UPLOADS_NAME));
    const apiSpec = (0, swagger_jsdoc_1.default)(swagger_1.default);
    app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(apiSpec));
    admin_1.default.createIfNotExists().catch((e) => logger_1.default.error(e));
    app
        .listen(process.env.SERVER_PORT, () => {
        logger_1.default.info(`The server is running on port ${process.env.SERVER_PORT}`);
    })
        .on('error', (err) => logger_1.default.error(err.message));
};
exports.default = initializeApp;
