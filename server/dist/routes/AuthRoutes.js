"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AuthController_1 = require("../controllers/AuthController");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express = require('express');
const router = express.Router();
const combinedAuthMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET);
            req.userId = decoded.id;
            // Check if the token belongs to an owner
            if (decoded.ownerId) {
                req.userType = 'OWNER';
                req.ownerId = decoded.ownerId;
            }
            else {
                // For regular users and admins
                req.userType =
                    decoded.role === 'ADMIN' ? 'ADMIN' : 'USER';
            }
            next();
        }
        catch (error) {
            res.status(401).json({ message: 'Invalid token' });
        }
    }
    else {
        res.status(401).json({ message: 'No token provided' });
    }
};
router.get('/me', combinedAuthMiddleware, AuthController_1.getCurrentUser);
exports.default = router;
