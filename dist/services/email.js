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
const nodemailer_1 = __importDefault(require("nodemailer"));
const pug_1 = __importDefault(require("pug"));
const path_1 = __importDefault(require("path"));
const { EMAIL_HOST, EMAIL_PORT, EMAIL_USERNAME, EMAIL_PASSWORD } = process.env;
const transporter = nodemailer_1.default.createTransport({
    host: EMAIL_HOST,
    port: Number(EMAIL_PORT),
    auth: {
        user: EMAIL_USERNAME,
        pass: EMAIL_PASSWORD,
    },
});
const Email = {
    sendMail(email, template, data = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const html = pug_1.default.renderFile(`${path_1.default.resolve('emails', template.file)}`, data);
            yield transporter.sendMail({
                from: `Ucode Uevent`,
                to: email,
                subject: template.subject,
                html,
            });
        });
    },
};
exports.default = Email;
