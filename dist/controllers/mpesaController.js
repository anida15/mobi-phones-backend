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
exports.mpesaController = void 0;
const express_validator_1 = require("express-validator");
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)(); // Load environment variables from .env file
class mpesaController {
    static stkPush(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                console.log('Validation errors:', errors.array());
                return res.status(400).json({ errors: errors.array() });
            }
            const { phone, amount } = req.body;
            function generateTimestamp() {
                const now = new Date();
                const year = now.getFullYear();
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const date = String(now.getDate()).padStart(2, '0');
                const hours = String(now.getHours()).padStart(2, '0');
                const minutes = String(now.getMinutes()).padStart(2, '0');
                const seconds = String(now.getSeconds()).padStart(2, '0');
                return `${year}${month}${date}${hours}${minutes}${seconds}`;
            }
            const Timestamp = generateTimestamp();
            const BusinessShortCode = process.env.MPESA_STORENUMBER;
            const passkey = process.env.MPESA_PASSKEY;
            const consumerKey = process.env.MPESA_CONSUMER_KEY;
            const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
            // Ensure environment variables are defined
            if (!BusinessShortCode || !passkey || !consumerKey || !consumerSecret) {
                console.error('Missing environment variables');
                return res.status(400).json({ errors: 'Missing environment variables' });
            }
            // Create the password
            const password = Buffer.from(BusinessShortCode + passkey + Timestamp).toString("base64");
            console.log("Generated password:", password);
            // Function to generate OAuth2 token
            const generateToken = () => __awaiter(this, void 0, void 0, function* () {
                const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
                try {
                    const response = yield axios_1.default.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
                        headers: {
                            Authorization: `Basic ${auth}`
                        }
                    });
                    console.log('Token response:', response.data.access_token);
                    return response.data.access_token;
                }
                catch (error) {
                    console.error('Error generating token:', error);
                    throw new Error('Failed to generate token');
                }
            });
            try {
                const token = yield generateToken();
                const mpesaRequest = {
                    "BusinessShortCode": BusinessShortCode,
                    "Password": password,
                    "Timestamp": Timestamp,
                    "TransactionType": "CustomerPayBillOnline",
                    "Amount": amount,
                    "PartyA": phone,
                    "PartyB": BusinessShortCode,
                    "PhoneNumber": phone,
                    "CallBackURL": "https://f97d-41-90-179-220.ngrok-free.app",
                    "AccountReference": phone,
                    "TransactionDesc": "Payment for invoice INV12345"
                };
                const response = yield axios_1.default.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', mpesaRequest, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                console.log('STK Push response:', response.data);
                res.status(200).json({ message: 'STK Push initiated', data: response.data });
            }
            catch (error) {
                console.error('STK Push error:', error);
                res.status(500).json({ message: 'STK Push failed', error: error });
            }
        });
    }
}
exports.mpesaController = mpesaController;
