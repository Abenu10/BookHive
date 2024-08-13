"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const walletController_1 = require("../controllers/walletController");
const express = require('express');
const router = express.Router();
router.post('/:userId/deposit', authMiddleware_1.default, walletController_1.deposit);
router.post('/:userId/withdraw', authMiddleware_1.default, walletController_1.withdraw);
router.get('/:userId', authMiddleware_1.default, walletController_1.getBalance);
exports.default = router;
