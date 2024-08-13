import verifyToken from '../middlewares/authMiddleware';

import {getBalance, deposit, withdraw} from '../controllers/walletController';

const express = require('express');
const router = express.Router();

router.post('/:userId/deposit', verifyToken, deposit);
router.post('/:userId/withdraw', verifyToken, withdraw);
router.get('/:userId', verifyToken, getBalance);

export default router;
