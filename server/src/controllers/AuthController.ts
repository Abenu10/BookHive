import {Request, Response} from 'express';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export const getCurrentUser = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const userType = (req as any).userType;

  try {
    let user;
    let roles;

    switch (userType) {
      case 'USER':
        user = await prisma.user.findUnique({
          where: {id: userId},
          select: {id: true, name: true, email: true, role: true},
        });
        roles = user ? [user.role] : [];
        break;
      case 'ADMIN':
        user = await prisma.user.findUnique({
          where: {id: userId, role: 'ADMIN'},
          select: {id: true, name: true, email: true, role: true},
        });
        roles = user ? [user.role] : [];
        break;
      case 'OWNER':
        user = await prisma.owner.findUnique({
          where: {id: userId},
          select: {id: true, name: true, email: true},
        });
        roles = ['OWNER'];
        break;
      default:
        return res.status(400).json({message: 'Invalid user type'});
    }

    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    res.json({user, roles});
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({message: 'Error fetching user data'});
  }
};
