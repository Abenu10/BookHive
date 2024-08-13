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
  getCategories
} from '../controllers/OwnerController';
import verifyOwnerToken from '../middlewares/ownerMiddleware';
import  upload  from '../middlewares/upload';

const express = require('express');
const router = express.Router();

router.post('/register', registerOwner);
router.post('/login', loginOwner);
router.post('/create-book', verifyOwnerToken, upload.single('coverImage'), createBook);
router.patch('/update-book/:bookId', verifyOwnerToken, upload.single('coverImage'), updateBook);
// TODO get all books
router.get('/book', verifyOwnerToken, getAllOwnerBooks);
router.get('/book/:bookId', verifyOwnerToken, getAllOwnerBooksById);
router.delete('/book/:bookId', verifyOwnerToken, deleteBook);

router.post('/:ownerId/withdraw', verifyOwnerToken, ownerWithdraw);
router.get('/:ownerId', verifyOwnerToken, getOwnerBalance);
router.post('/logout', ownerLogout);

router.get('/category/all', getCategories);

export default router;
