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
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db");
const config_1 = require("../config");
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        console.log("Cookies received:", req.cookies);
        const cookie = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.uuid;
        if (!cookie) {
            res.status(400).json({ message: "Cookie not found" });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(cookie, config_1.JWT_SECRET);
        if (!decoded || !decoded.email) {
            res.status(400).json({ message: "Invalid token" });
            return;
        }
        const user = yield db_1.prismaClient.user.findUnique({ where: { email: decoded.email } });
        if (!user) {
            res.status(400).json({ message: "User not found" });
            return;
        }
        //@ts-ignore
        req.user = user;
        next();
    }
    catch (err) {
        console.error("Authentication error:", err);
        res.status(401).json({ message: "Authentication failed" });
        return;
    }
});
exports.authenticate = authenticate;
