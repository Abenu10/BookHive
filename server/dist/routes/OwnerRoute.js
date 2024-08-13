"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const OwnerController_1 = require("../controllers/OwnerController");
const ownerMiddleware_1 = __importDefault(require("../middlewares/ownerMiddleware"));
const upload_1 = __importDefault(require("../middlewares/upload"));
const express = require('express');
const router = express.Router();
router.post('/register', OwnerController_1.registerOwner);
router.post('/login', OwnerController_1.loginOwner);
router.post('/create-book', ownerMiddleware_1.default, upload_1.default.single('coverImage'), OwnerController_1.createBook);
router.patch('/update-book/:bookId', ownerMiddleware_1.default, upload_1.default.single('coverImage'), OwnerController_1.updateBook);
// TODO get all books
router.get('/book', ownerMiddleware_1.default, OwnerController_1.getAllOwnerBooks);
router.get('/book/:bookId', ownerMiddleware_1.default, OwnerController_1.getAllOwnerBooksById);
router.delete('/book/:bookId', ownerMiddleware_1.default, OwnerController_1.deleteBook);
router.post('/:ownerId/withdraw', ownerMiddleware_1.default, OwnerController_1.ownerWithdraw);
router.get('/:ownerId', ownerMiddleware_1.default, OwnerController_1.getOwnerBalance);
router.post('/logout', OwnerController_1.ownerLogout);
router.get('/category/all', OwnerController_1.getCategories);
exports.default = router;
