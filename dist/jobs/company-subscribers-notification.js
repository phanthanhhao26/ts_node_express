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
exports.scheduleCompanySubscribersNotification = void 0;
const cron_1 = require("cron");
const email_1 = __importDefault(require("../consts/email"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const services_1 = require("../services");
const add_minutes_1 = __importDefault(require("../utils/add-minutes"));
const compare_dates_1 = require("../utils/compare-dates");
const scheduleCompanySubscribersNotification = (tickDate, eventId) => {
    const now = new Date();
    if ((0, compare_dates_1.compareDates)(tickDate, now) !== 1) {
        tickDate = (0, add_minutes_1.default)(now, 1);
    }
    new cron_1.CronJob(tickDate, () => __awaiter(void 0, void 0, void 0, function* () {
        const event = yield prisma_1.default.event.findUnique({
            where: { id: eventId },
            include: { company: { include: { subscribers: { include: { user: true } } } } },
        });
        if (!event || !event.company.subscribers.length) {
            return;
        }
        const { publishDate, name: eventName } = event;
        const companyName = event.company.name;
        const subscribers = event.company.subscribers.map((subscriber) => subscriber.user);
        const isPublishDateInPast = (0, compare_dates_1.compareDates)(publishDate, now) !== 1;
        const isTickDateEqualPublishDate = !(0, compare_dates_1.compareDates)(tickDate, publishDate);
        if (isPublishDateInPast || isTickDateEqualPublishDate) {
            notifyCompanySubscribers(companyName, eventName, eventId, subscribers);
        }
    }), null, true);
};
exports.scheduleCompanySubscribersNotification = scheduleCompanySubscribersNotification;
const notifyCompanySubscribers = (companyName, eventName, eventId, subscribers) => __awaiter(void 0, void 0, void 0, function* () {
    subscribers.forEach((subscriber) => {
        services_1.Email.sendMail(subscriber.email, email_1.default.EVENT_PUBLISHED, {
            eventName,
            companyName,
            eventId,
        });
    });
});
