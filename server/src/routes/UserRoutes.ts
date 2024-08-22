import {
  register,
  login,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  refreshToken,
  logout,
  getAvailableBooks,
  getBooksFromCategory,
  getCategories,
  getBookDetailById,
  searchBooks,
} from '../controllers/UserController';
import verifyToken from '../middlewares/authMiddleware';
import {validateRegister} from '../middlewares/validator';

const express = require('express');
const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', login);
router.get('/', verifyToken, getAllUsers);
router.get('/:id', verifyToken, getUserById);
router.put('/update', verifyToken, updateUser);
router.delete('/:id', verifyToken, deleteUser);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.get('/books/available', verifyToken, getAvailableBooks);
router.get('/books/:categoryId', verifyToken, getBooksFromCategory);
router.get('/books/category/all', verifyToken, getCategories);
router.get('/book/:bookId', verifyToken, getBookDetailById);
router.get('/search/book', verifyToken, searchBooks);

export default router;
