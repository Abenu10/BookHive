import verifyToken from '../middlewares/authMiddleware';
import {validateRegister} from '../middlewares/validator';
import {
  loginOwner,
  registerOwner,
  createBook,
  updateBook,
  getAllOwnerBooks,
  getAllOwnerBooksById,
  deleteBook,
  ownerWithdraw,
  getOwnerBalance,
  ownerLogout,
  getCategories,
  getFilteredOwnerBooks
} from '../controllers/OwnerController';
import upload from '../middlewares/upload';
import express from 'express';
import { checkAbility } from '../middlewares/checkAbility';
import { Actions, Subjects } from '../config/caslAbility';

const router = express.Router();

// Public routes
router.post('/register', registerOwner);
router.post('/login', loginOwner);

// Protected routes
router.use(verifyToken);

router.post('/create-book', checkAbility('create' as Actions, 'Book' as Subjects), upload.single('coverImage'), createBook);
router.patch('/update-book/:bookId', checkAbility('update' as Actions, 'Book' as Subjects), upload.single('coverImage'), updateBook);
router.get('/book', checkAbility('read' as Actions, 'OwnerBooks' as Subjects), getAllOwnerBooks);
router.get('/book/:bookId', checkAbility('read' as Actions, 'OwnerBooks' as Subjects), getAllOwnerBooksById);
router.delete('/book/:bookId', checkAbility('delete' as Actions, 'Book' as Subjects), deleteBook);
router.get('/filtered-books', checkAbility('read' as Actions, 'OwnerBooks' as Subjects), getFilteredOwnerBooks);

router.post('/withdraw', checkAbility('update' as Actions, 'OwnerWallet' as Subjects), ownerWithdraw);
router.get('/balance', checkAbility('read' as Actions, 'OwnerWallet' as Subjects), getOwnerBalance);
router.post('/logout', ownerLogout);

router.get('/category/all', checkAbility('read' as Actions, 'Category' as Subjects), getCategories);

export default router;