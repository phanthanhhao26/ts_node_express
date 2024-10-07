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
const email_1 = __importDefault(require("../consts/email"));
const payment_1 = require("../consts/payment");
const prisma_1 = __importDefault(require("../lib/prisma"));
const error_1 = __importDefault(require("../types/error"));
const email_2 = __importDefault(require("./email"));
const event_1 = __importStar(require("./event"));
const user_1 = __importDefault(require("./user"));
const events = prisma_1.default.event;
const eventUsers = prisma_1.default.userEvent;
const eventObjectToUserEvent = ({ metadata: m }) => ({
    eventId: JSON.parse(m.eventId),
    userId: JSON.parse(m.userId),
    isVisible: JSON.parse(m.isVisible),
});
const EventSubscription = {
    check(eventId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkIfConnected(eventId, userId);
            yield this.checkTicketAvailability(eventId);
        });
    },
    handleWith(eventMeta) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = eventObjectToUserEvent(eventMeta);
            yield this.connectUser(data);
            const [event, visitor] = yield Promise.all([
                this.getEventCreator(data.eventId),
                user_1.default.findOrThrow(data.userId),
            ]);
            const creator = event.company;
            if (event.ticketsAvailable !== payment_1.TICKETS_UNLIMITED) {
                yield this.updateEventTickets(event.id, event.ticketsAvailable - 1);
            }
            const mailToCreator = email_2.default.sendMail(creator.email, email_1.default.NEW_EVENT_VISITOR, {
                eventName: event.name,
                visitorName: visitor.fullName,
                eventId: event.id,
            });
            const mailToVisitor = email_2.default.sendMail(visitor.email, email_1.default.EVENT_SUBSCRIPTION, {
                eventName: event.name,
                eventDate: (0, event_1.getEventDate)(event.date),
                eventId: event.id,
            });
            yield Promise.all([mailToCreator, mailToVisitor]);
        });
    },
    getEventCreator(eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = yield events.findUnique({
                where: { id: eventId },
                include: {
                    company: true,
                },
            });
            if (!event) {
                throw new error_1.default('The event was not found.', 404);
            }
            return event;
        });
    },
    checkIfConnected(eventId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const exists = yield eventUsers.findUnique({
                where: {
                    userId_eventId: { userId, eventId },
                },
            });
            if (exists) {
                throw new error_1.default('You are already subscribed to this event.', 400);
            }
        });
    },
    checkTicketAvailability(eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = yield event_1.default.findEventIfExists(eventId);
            const tickets = event.ticketsAvailable;
            if (tickets <= 0 && tickets !== payment_1.TICKETS_UNLIMITED) {
                throw new error_1.default('No tickets are available for this event', 403);
            }
        });
    },
    updateEventTickets(eventId, ticketsAvailable) {
        return __awaiter(this, void 0, void 0, function* () {
            yield events.update({
                where: { id: eventId },
                data: { ticketsAvailable },
            });
        });
    },
    connectUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { eventId: id, userId, isVisible } = data;
            yield events.update({
                where: { id },
                data: {
                    visitors: {
                        create: { userId, isVisible },
                    },
                },
            });
        });
    },
};
exports.default = EventSubscription;
