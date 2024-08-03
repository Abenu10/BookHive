import {
  register,
  login,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  refreshToken,
} from '../controllers/UserController';
import {validateRegister} from '../middlewares/validator';

const express = require('express');
const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', login);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.post('/refresh-token', refreshToken);

export default router;
