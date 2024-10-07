"use strict";
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
exports.scheduleEventReminder = void 0;
const cron_1 = require("cron");
const default_1 = require("../consts/default");
const email_1 = __importDefault(require("../consts/email"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const services_1 = require("../services");
const event_1 = require("../services/event");
const compare_dates_1 = require("../utils/compare-dates");
const subtract_hours_1 = __importDefault(require("../utils/subtract-hours"));
const scheduleEventReminder = (tickDate, eventId) => {
    new cron_1.CronJob(tickDate, () => __awaiter(void 0, void 0, void 0, function* () {
        const event = yield prisma_1.default.event.findUnique({
            where: { id: eventId },
            include: { visitors: { include: { user: true } }, company: true },
        });
        if (!event || !event.visitors.length) {
            return;
        }
        const { date: eventDate, name: eventName } = event;
        const visitors = event.visitors.map((visitor) => visitor.user);
        const sendRemindersDate = (0, subtract_hours_1.default)(eventDate, default_1.HOURS_BEFORE_EVENT);
        if (!(0, compare_dates_1.compareDates)(tickDate, sendRemindersDate)) {
            sendReminders(eventName, (0, event_1.getEventDate)(eventDate), eventId, visitors);
        }
    }), null, true);
};
exports.scheduleEventReminder = scheduleEventReminder;
const sendReminders = (eventName, eventDate, eventId, visitors) => __awaiter(void 0, void 0, void 0, function* () {
    visitors.forEach((visitor) => {
        services_1.Email.sendMail(visitor.email, email_1.default.EVENT_REMINDER, {
            eventName,
            eventDate,
            hoursBeforeEvent: default_1.HOURS_BEFORE_EVENT,
            eventId,
        });
    });
});
