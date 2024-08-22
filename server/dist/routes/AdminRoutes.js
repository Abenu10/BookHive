"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AdminController_1 = require("../controllers/AdminController");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const validator_1 = require("../middlewares/validator");
const express = require('express');
const router = express.Router();
router.get('/filtered-books', authMiddleware_1.default, AdminController_1.getFilteredBooks);
router.get('/filtered-owners', authMiddleware_1.default, AdminController_1.getFilteredOwners);
router.post('/register', validator_1.validateRegister, AdminController_1.registerAdmin);
router.post('/login', AdminController_1.loginAdmin);
router.put('/update', authMiddleware_1.default, AdminController_1.updateAdmin);
router.delete('/:id', authMiddleware_1.default, AdminController_1.deleteAdmin);
router.get('/get-owners', authMiddleware_1.default, AdminController_1.getAllOwners);
router.patch('/activate-deactivate-owner/:ownerId', authMiddleware_1.default, AdminController_1.toggleOwnerStatus);
router.patch('/toggle-book-status/:bookId', authMiddleware_1.default, AdminController_1.toggleBookStatus);
router.get('/get-all-books', authMiddleware_1.default, AdminController_1.getAllBooks);
router.delete('/book/:bookId', authMiddleware_1.default, AdminController_1.deleteBook);
router.post('/create-category', authMiddleware_1.default, AdminController_1.createCategory);
router.delete('/category/delete/:id', authMiddleware_1.default, AdminController_1.deleteCategory);
exports.default = router;
