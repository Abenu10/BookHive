import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

// Extend the Request interface
interface CustomRequest extends Request {
  userId?: string;
}

const verifyToken = (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).send({message: 'No token provided!'});
  }

  jwt.verify(token, process.env.JWT_ACCESS_SECRET as string, (err, decoded) => {
    if (err) {
      return res.status(401).send({message: 'Unauthorized!'});
    }
    req.userId = (decoded as any).id;
    next();
  });
};

export default verifyToken;
