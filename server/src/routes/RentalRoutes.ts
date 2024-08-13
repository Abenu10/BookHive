import verifyToken from '../middlewares/authMiddleware';

import {
  createRental,
  getRental,
  returnRental,
  getUserRentals,
  isBookRentedByUser,
  toggleRentalStatus
} from '../controllers/RentalController';

const express = require('express');
const router = express.Router();

router.post('/new-rental', verifyToken, createRental);
router.get('/:rentalId', verifyToken, getRental);
router.patch('/:rentalId/return', verifyToken, returnRental);
router.get('/:userId/rentals', verifyToken, getUserRentals);
router.get('/:userId/book/:bookId/rented', verifyToken, isBookRentedByUser);
router.post('/:userId/book/:bookId/toggle', verifyToken, toggleRentalStatus);


export default router;
