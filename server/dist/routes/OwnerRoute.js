"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const OwnerController_1 = require("../controllers/OwnerController");
const upload_1 = __importDefault(require("../middlewares/upload"));
const express_1 = __importDefault(require("express"));
const checkAbility_1 = require("../middlewares/checkAbility");
const router = express_1.default.Router();
// Public routes
router.post('/register', OwnerController_1.registerOwner);
router.post('/login', OwnerController_1.loginOwner);
// Protected routes
router.use(authMiddleware_1.default);
router.post('/create-book', (0, checkAbility_1.checkAbility)('create', 'Book'), upload_1.default.single('coverImage'), OwnerController_1.createBook);
router.patch('/update-book/:bookId', (0, checkAbility_1.checkAbility)('update', 'Book'), upload_1.default.single('coverImage'), OwnerController_1.updateBook);
router.get('/book', (0, checkAbility_1.checkAbility)('read', 'OwnerBooks'), OwnerController_1.getAllOwnerBooks);
router.get('/book/:bookId', (0, checkAbility_1.checkAbility)('read', 'OwnerBooks'), OwnerController_1.getAllOwnerBooksById);
router.delete('/book/:bookId', (0, checkAbility_1.checkAbility)('delete', 'Book'), OwnerController_1.deleteBook);
router.get('/filtered-books', (0, checkAbility_1.checkAbility)('read', 'OwnerBooks'), OwnerController_1.getFilteredOwnerBooks);
router.post('/withdraw', (0, checkAbility_1.checkAbility)('update', 'OwnerWallet'), OwnerController_1.ownerWithdraw);
router.get('/balance', (0, checkAbility_1.checkAbility)('read', 'OwnerWallet'), OwnerController_1.getOwnerBalance);
router.post('/logout', OwnerController_1.ownerLogout);
router.get('/category/all', (0, checkAbility_1.checkAbility)('read', 'Category'), OwnerController_1.getCategories);
exports.default = router;
