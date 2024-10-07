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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeWebhook = exports.createSession = exports.getAccountLink = exports.createAccount = void 0;
const event_1 = __importDefault(require("../services/event"));
const stripe_1 = __importStar(require("../lib/stripe"));
const payment_1 = require("../consts/payment");
const event_subscription_1 = __importDefault(require("../services/event-subscription"));
const logger_1 = __importDefault(require("../lib/logger"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const company_1 = __importDefault(require("../services/company"));
const promoCode = prisma_1.default.promoCode;
const getDiscount = (eventId, curPromoCode) => __awaiter(void 0, void 0, void 0, function* () {
    if (!curPromoCode) {
        return 0;
    }
    const found = yield promoCode.findFirst({
        where: {
            promoCode: curPromoCode,
            eventId,
        },
    });
    return found ? found.discount : 0;
});
const stripeLineItem = (event, discount) => ({
    price_data: {
        currency: 'usd',
        product_data: {
            name: `Ticket for the '${event.name}' event`,
        },
        unit_amount: Number(event.price) * (100 - discount),
    },
    quantity: 1,
});
const createAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const companyId = Number(req.params.id);
    const company = yield company_1.default.findOneOrThrow(companyId);
    if (!company.stripeId) {
        const account = yield stripe_1.default.accounts.create({
            type: 'express',
            default_currency: 'usd',
        });
        const updated = yield company_1.default.update(companyId, {
            stripeId: account.id,
        });
        company.stripeId = updated.stripeId;
    }
    const accountLink = yield stripe_1.default.accountLinks.create({
        account: company.stripeId,
        refresh_url: process.env.CLIENT_URL,
        return_url: process.env.CLIENT_URL,
        type: 'account_onboarding',
    });
    res.json({ url: accountLink.url });
});
exports.createAccount = createAccount;
const getAccountLink = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const companyId = Number(req.params.id);
    const stripeId = yield company_1.default.isStripeConnected(companyId);
    yield company_1.default.checkAccountOrThrow(stripeId);
    const loginLink = yield stripe_1.default.accounts.createLoginLink(stripeId);
    res.json({ url: loginLink.url });
});
exports.getAccountLink = getAccountLink;
const createSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eventId = Number(req.params.id);
    const user = req.user;
    const isVisible = String(req.body.isVisible);
    const event = yield event_1.default.findEventIfExists(eventId);
    yield event_subscription_1.default.check(event.id, user.id);
    if (Number(event.price) === 0) {
        const meta = {
            metadata: {
                isVisible,
                eventId: String(eventId),
                userId: String(user.id),
            },
        };
        yield event_subscription_1.default.handleWith(meta);
        return res.json({ sessionId: -1 });
    }
    const stripeId = yield company_1.default.isStripeConnected(event.companyId);
    yield company_1.default.checkAccountOrThrow(stripeId);
    const discount = yield getDiscount(eventId, req.body.promoCode);
    const params = Object.assign(Object.assign({}, payment_1.STRIPE_PAYMENT_OPTIONS), { line_items: [stripeLineItem(event, discount)], customer_email: user.email, payment_intent_data: {
            metadata: { eventId, userId: user.id, isVisible },
            transfer_data: {
                destination: stripeId,
            },
        } });
    const session = yield stripe_1.default.checkout.sessions.create(params);
    res.json({ sessionId: session.id });
});
exports.createSession = createSession;
const stripeWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        event = stripe_1.default.webhooks.constructEvent(req.body, sig, stripe_1.STRIPE_WEBHOOK_KEY);
    }
    catch (err) {
        throw new Error(`Stripe webhook error: ${err}`);
    }
    if (event.type === 'payment_intent.succeeded') {
        const meta = event.data.object;
        yield event_subscription_1.default.handleWith(meta);
        logger_1.default.info('Your payment was successful');
    }
    if (event.type === 'account.updated') {
        if (!event.account) {
            return res.sendStatus(500);
        }
        const account = yield stripe_1.default.accounts.retrieve(event.account);
        if (!account.details_submitted) {
            logger_1.default.error('Not all account information has been completed yet.');
            return res.sendStatus(500);
        }
    }
    res.sendStatus(200);
});
exports.stripeWebhook = stripeWebhook;
