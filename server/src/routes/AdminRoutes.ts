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
} from '../controllers/AdminController';
import verifyToken from '../middlewares/authMiddleware';
import {validateRegister} from '../middlewares/validator';

const express = require('express');
const router = express.Router();

router.get('/filtered-owners', verifyToken, getFilteredOwners);
router.post('/register', validateRegister, registerAdmin);
router.post('/login', loginAdmin);
router.put('/update', verifyToken, updateAdmin);
router.delete('/:id', verifyToken, deleteAdmin);
router.get('/get-owners', verifyToken, getAllOwners);
router.patch(
  '/activate-deactivate-owner/:ownerId',
  verifyToken,
  toggleOwnerStatus
);
router.patch('/toggle-book-status/:bookId', verifyToken, toggleBookStatus);
router.get('/get-all-books', verifyToken, getAllBooks);
router.delete('/book/:bookId', verifyToken, deleteBook);
router.post('/create-category', verifyToken, createCategory);
router.delete('/category/delete/:id', verifyToken, deleteCategory);

export default router;
