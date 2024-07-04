"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// Define routes for phones
router.get('/', (req, res) => {
    // Handle GET request for fetching all phones
    console.log('GET request for fetching all phones');
});
router.post('/', (req, res) => {
    // Handle POST request for creating a new phone
    console.log(req.body);
});
router.get('/:id', (req, res) => {
    // Handle GET request for fetching a specific phone by ID
});
router.put('/:id', (req, res) => {
    // Handle PUT request for updating a phone by ID
});
router.delete('/:id', (req, res) => {
    // Handle DELETE request for deleting a phone by ID
});
exports.default = router;
