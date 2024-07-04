"use strict";
// routes/users.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
// token refreshing
router.post('/refresh', userController_1.UserController.refreshToken);
// Define routes for users
router.post('/login', [
    (0, express_validator_1.body)('username')
        .trim()
        .matches(/^[a-zA-Z0-9_\-]+$/).withMessage('Username must contain only letters, numbers, underscores, or hyphens'),
    (0, express_validator_1.body)('password')
        .trim().notEmpty().withMessage('Password is required'),
    (0, express_validator_1.body)('username').notEmpty().withMessage('Username or email is required'),
], userController_1.UserController.loginUser);
router.post('/register', [
    (0, express_validator_1.body)('username')
        .trim()
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long')
        .matches(/^[a-zA-Z0-9_\-]+$/).withMessage('Username must contain only letters, numbers, underscores, or hyphens'),
    (0, express_validator_1.body)('email')
        .isEmail().withMessage('Email is not valid')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .isLength({ min: 5 }).withMessage('Password must be at least 5 characters long')
        .matches(/^[a-zA-Z0-9!@#$%^&*]+$/).withMessage('Password must contain only letters, numbers, or special characters like !@#$%^&*'),
], userController_1.UserController.registerUser);
router.get('/:id', userController_1.UserController.getUserById);
router.put('/:id', userController_1.UserController.updateUserById);
router.delete('/:id', userController_1.UserController.deleteUserById);
exports.default = router;
