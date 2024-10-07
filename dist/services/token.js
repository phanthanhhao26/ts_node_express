"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const { TOKEN_SECRET, TOKEN_EXPIRES_IN } = process.env;
const Token = {
    generate(payload, options = {}) {
        const expiresIn = options.expiresIn || TOKEN_EXPIRES_IN;
        return jsonwebtoken_1.default.sign(payload, TOKEN_SECRET, { expiresIn });
    },
    validate(token) {
        try {
            return jsonwebtoken_1.default.verify(token || '', TOKEN_SECRET);
        }
        catch (_err) {
            return null;
        }
    },
    generateConfirmToken(payload) {
        return Token.generate(payload, { expiresIn: '1h' });
    },
};
exports.default = Token;
