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
exports.UserController = void 0;
const express_validator_1 = require("express-validator");
const User_1 = require("../models/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = __importDefault(require("../config/database"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// TODO: implement security key
const jwtSecret = 'your-jwt-secret';
const jwtExpiry = 300; // 5 minutes in seconds
class UserController {
    // Grab username and userid from request to refresh tokens 
    static refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, userId } = req.body;
            if (!username || !userId) {
                return res.status(400).json({ message: 'Username and user ID are required' });
            }
            // Generate new JWT
            const token = jsonwebtoken_1.default.sign({ userId, username }, jwtSecret, { expiresIn: jwtExpiry });
            res.status(200).json({ message: 'Token refreshed', token });
        });
    }
    // Login class
    static loginUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { username, password } = req.body;
            try {
                const [users] = yield database_1.default.execute('SELECT * FROM users WHERE email = ? OR username = ?', [username, username]);
                if (users.length === 0) {
                    return res.status(401).json({ message: 'Invalid username or password' });
                }
                const user = users[0];
                // Compare passwords
                const match = yield bcrypt_1.default.compare(password, user.password);
                if (!match) {
                    return res.status(401).json({ message: 'Invalid username or password' });
                }
                // Generate JWT
                const token = jsonwebtoken_1.default.sign({ userId: user.id, username: user.username }, jwtSecret, { expiresIn: jwtExpiry });
                res.status(200).json({ message: 'Login successful', token });
            }
            catch (error) {
                console.error('Error during login:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    // Register class
    static registerUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { username, email, privilege, password } = req.body;
            try {
                // Check if the user already exists
                const [existingUser] = yield database_1.default.execute('SELECT * FROM users WHERE email = ? OR username = ?', [email, username]);
                if (Array.isArray(existingUser) && existingUser.length > 0) {
                    return res.status(400).json({ message: 'User with this email or username already exists' });
                }
                // Hash the password
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                // Create a new user object
                const user = new User_1.User(username, email, privilege, hashedPassword);
                // Store user in the database
                const [result] = yield database_1.default.execute('INSERT INTO users (username, email,privilege, password) VALUES (?, ?,?, ?)', [user.username, user.email, user.privilege, user.password]);
                res.status(201).json({ message: 'User registered successfully' });
            }
            catch (error) {
                console.error('Error registering user:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    static getUserById(req, res) {
        res.send(`Fetching user with ID ${req.params.id}`);
    }
    static updateUserById(req, res) {
        res.send(`Updating user with ID ${req.params.id}`);
    }
    static deleteUserById(req, res) {
        res.send(`Deleting user with ID ${req.params.id}`);
    }
}
exports.UserController = UserController;
