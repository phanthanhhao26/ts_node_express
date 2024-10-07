"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.STRIPE_WEBHOOK_KEY = exports.Stripe = void 0;
const stripe_1 = __importDefault(require("stripe"));
exports.Stripe = stripe_1.default;
const payment_1 = require("../consts/payment");
Object.defineProperty(exports, "STRIPE_WEBHOOK_KEY", { enumerable: true, get: function () { return payment_1.STRIPE_WEBHOOK_KEY; } });
const stripe = new stripe_1.default(payment_1.STRIPE_API_SECRET_KEY, payment_1.STRIPE_CONFIG);
exports.default = stripe;
