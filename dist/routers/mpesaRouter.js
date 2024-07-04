"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const mpesaController_1 = require("../controllers/mpesaController");
const router = express_1.default.Router();
// Define routes for mpesa
router.post('/stkPush', [
    (0, express_validator_1.body)('amount')
        .isNumeric().withMessage('Amount must be a number'),
    (0, express_validator_1.body)('phone')
        .isNumeric().withMessage('Phone number is not valid'),
], mpesaController_1.mpesaController.stkPush);
exports.default = router;
