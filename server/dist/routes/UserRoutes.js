"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserController_1 = require("../controllers/UserController");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const validator_1 = require("../middlewares/validator");
const express = require('express');
const router = express.Router();
router.post('/register', validator_1.validateRegister, UserController_1.register);
router.post('/login', UserController_1.login);
router.get('/', authMiddleware_1.default, UserController_1.getAllUsers);
router.get('/:id', authMiddleware_1.default, UserController_1.getUserById);
router.put('/update', authMiddleware_1.default, UserController_1.updateUser);
router.delete('/:id', authMiddleware_1.default, UserController_1.deleteUser);
router.post('/refresh-token', UserController_1.refreshToken);
router.post('/logout', UserController_1.logout);
router.get('/books/available', authMiddleware_1.default, UserController_1.getAvailableBooks);
router.get('/books/:categoryId', authMiddleware_1.default, UserController_1.getBooksFromCategory);
router.get('/books/category/all', authMiddleware_1.default, UserController_1.getCategories);
router.get('/book/:bookId', authMiddleware_1.default, UserController_1.getBookDetailById);
router.get('/search/book', authMiddleware_1.default, UserController_1.searchBooks);
exports.default = router;
