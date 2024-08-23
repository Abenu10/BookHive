import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

interface CustomRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

const verifyOwnerToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as any;
    req.user = {
      id: decoded.id,
      role: decoded.role
    };
    if (req.user.role !== 'OWNER') {
      return res.status(403).json({ message: 'Access denied. Owner role required.' });
    }
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export default verifyOwnerToken;