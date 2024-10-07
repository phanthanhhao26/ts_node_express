"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TICKETS_UNLIMITED = exports.STRIPE_PAYMENT_OPTIONS = exports.STRIPE_CONFIG = exports.STRIPE_WEBHOOK_KEY = exports.STRIPE_API_SECRET_KEY = void 0;
const CLIENT_URL = process.env.CLIENT_URL;
exports.STRIPE_API_SECRET_KEY = process.env.STRIPE_API_SECRET_KEY;
exports.STRIPE_WEBHOOK_KEY = process.env.STRIPE_WEBHOOK_KEY;
exports.STRIPE_CONFIG = {
    apiVersion: '2022-11-15',
};
exports.STRIPE_PAYMENT_OPTIONS = {
    payment_method_types: ['card'],
    mode: 'payment',
    success_url: `${CLIENT_URL}/payment/success`,
    cancel_url: `${CLIENT_URL}/payment/cancel`,
};
exports.TICKETS_UNLIMITED = -1;
