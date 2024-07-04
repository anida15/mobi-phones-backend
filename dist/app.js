"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const phoneRouter_1 = __importDefault(require("./routers/phoneRouter"));
const userRouter_1 = __importDefault(require("./routers/userRouter"));
const mpesaRouter_1 = __importDefault(require("./routers/mpesaRouter"));
const app = (0, express_1.default)();
// Configure CORS options
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};
// Use CORS middleware with the specified options
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use('/api/phones', phoneRouter_1.default);
app.use('/api/users', userRouter_1.default);
app.use('/api/mpesa', mpesaRouter_1.default);
;
exports.default = app;
