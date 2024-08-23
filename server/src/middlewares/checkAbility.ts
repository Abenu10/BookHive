import { Request, Response, NextFunction } from 'express';
import { buildAbility, Actions, Subjects } from '../config/caslAbility';

export const checkAbility = (action: Actions, subject: Subjects) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || !user.role) {
      console.error('User or user role not found in request:', user);
      return res.status(403).json({ error: 'Unauthorized: User role not found' });
    }
    const ability = buildAbility(user.role);
    if (ability.can(action, subject)) {
      next();
    } else {
      console.error(`Authorization failed for ${user.role} trying to ${action} on ${subject}`);
      res.status(403).json({ error: 'Unauthorized' });
    }
  };
};