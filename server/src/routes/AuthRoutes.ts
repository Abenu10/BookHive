import {getCurrentUser} from '../controllers/AuthController';
import verifyToken from '../middlewares/authMiddleware';
import verifyOwnerToken from '../middlewares/ownerMiddleware';
import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

const express = require('express');
const router = express.Router();

const combinedAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET as string
      );
      (req as any).userId = (decoded as any).id;

      // Check if the token belongs to an owner
      if ((decoded as any).ownerId) {
        (req as any).userType = 'OWNER';
        (req as any).ownerId = (decoded as any).ownerId;
      } else {
        // For regular users and admins
        (req as any).userType =
          (decoded as any).role === 'ADMIN' ? 'ADMIN' : 'USER';
      }

      next();
    } catch (error) {
      res.status(401).json({message: 'Invalid token'});
    }
  } else {
    res.status(401).json({message: 'No token provided'});
  }
};

router.get('/me', combinedAuthMiddleware, getCurrentUser);
export default router;
