"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AdminController_1 = require("../controllers/AdminController");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const validator_1 = require("../middlewares/validator");
const express_1 = __importDefault(require("express"));
const checkAbility_1 = require("../middlewares/checkAbility");
const router = express_1.default.Router();
// Public routes (no token required)
router.post('/register', validator_1.validateRegister, AdminController_1.registerAdmin);
router.post('/login', AdminController_1.loginAdmin);
// Apply verifyToken to all protected routes
router.use(authMiddleware_1.default);
// Protected routes
router.get('/filtered-books', (0, checkAbility_1.checkAbility)('read', 'AdminBooks'), AdminController_1.getFilteredBooks);
router.get('/filtered-owners', (0, checkAbility_1.checkAbility)('read', 'Owners'), AdminController_1.getFilteredOwners);
router.put('/update', (0, checkAbility_1.checkAbility)('update', 'User'), AdminController_1.updateAdmin);
router.delete('/:id', (0, checkAbility_1.checkAbility)('delete', 'User'), AdminController_1.deleteAdmin);
router.get('/get-owners', (0, checkAbility_1.checkAbility)('read', 'Owners'), AdminController_1.getAllOwners);
router.patch('/activate-deactivate-owner/:ownerId', (0, checkAbility_1.checkAbility)('update', 'toggleOwner'), AdminController_1.toggleOwnerStatus);
router.patch('/toggle-book-status/:bookId', (0, checkAbility_1.checkAbility)('update', 'toggleBook'), AdminController_1.toggleBookStatus);
router.get('/get-all-books', (0, checkAbility_1.checkAbility)('read', 'AdminBooks'), AdminController_1.getAllBooks);
router.delete('/book/:bookId', (0, checkAbility_1.checkAbility)('delete', 'Book'), AdminController_1.deleteBook);
router.post('/create-category', (0, checkAbility_1.checkAbility)('create', 'Category'), AdminController_1.createCategory);
router.delete('/category/delete/:id', (0, checkAbility_1.checkAbility)('delete', 'Category'), AdminController_1.deleteCategory);
exports.default = router;
