"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const RentalController_1 = require("../controllers/RentalController");
const express = require('express');
const router = express.Router();
router.post('/new-rental', authMiddleware_1.default, RentalController_1.createRental);
router.get('/:rentalId', authMiddleware_1.default, RentalController_1.getRental);
router.patch('/:rentalId/return', authMiddleware_1.default, RentalController_1.returnRental);
router.get('/:userId/rentals', authMiddleware_1.default, RentalController_1.getUserRentals);
router.get('/:userId/book/:bookId/rented', authMiddleware_1.default, RentalController_1.isBookRentedByUser);
router.post('/:userId/book/:bookId/toggle', authMiddleware_1.default, RentalController_1.toggleRentalStatus);
exports.default = router;
