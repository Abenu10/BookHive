import {
  createCategory,
  getAllBooks,
  getAllOwners,
  registerAdmin,
  loginAdmin,
  updateAdmin,
  deleteAdmin,
  deleteBook,
  toggleOwnerStatus,
  toggleBookStatus,
  getFilteredOwners,
  deleteCategory,
  getFilteredBooks,
} from '../controllers/AdminController';
import verifyToken from '../middlewares/authMiddleware';
import { validateRegister } from '../middlewares/validator';
import express from 'express';
import { checkAbility } from '../middlewares/checkAbility';
import { Actions, Subjects } from '../config/caslAbility';

const router = express.Router();

// Public routes (no token required)
router.post('/register', validateRegister, registerAdmin);
router.post('/login', loginAdmin);

// Apply verifyToken to all protected routes
router.use(verifyToken);

// Protected routes
router.get('/filtered-books', checkAbility('read' as Actions, 'AdminBooks' as Subjects), getFilteredBooks);
router.get('/filtered-owners', checkAbility('read' as Actions, 'Owners' as Subjects), getFilteredOwners);
router.put('/update', checkAbility('update' as Actions, 'User' as Subjects), updateAdmin);
router.delete('/:id', checkAbility('delete' as Actions, 'User' as Subjects), deleteAdmin);
router.get('/get-owners', checkAbility('read' as Actions, 'Owners' as Subjects), getAllOwners);
router.patch(
  '/activate-deactivate-owner/:ownerId',
  checkAbility('update' as Actions, 'toggleOwner' as Subjects),
  toggleOwnerStatus
);
router.patch(
  '/toggle-book-status/:bookId',
  checkAbility('update' as Actions, 'toggleBook' as Subjects),
  toggleBookStatus
);
router.get('/get-all-books', checkAbility('read' as Actions, 'AdminBooks' as Subjects), getAllBooks);
router.delete('/book/:bookId', checkAbility('delete' as Actions, 'Book' as Subjects), deleteBook);
router.post('/create-category', checkAbility('create' as Actions, 'Category' as Subjects), createCategory);
router.delete('/category/delete/:id', checkAbility('delete' as Actions, 'Category' as Subjects), deleteCategory);

export default router;