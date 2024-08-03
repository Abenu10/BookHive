import {Request, Response, NextFunction} from 'express';

const ErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
};

export default ErrorHandler;
