import {Request, Response} from 'express';
import {PrismaClient, Prisma} from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  const {name, email, password, role}: Prisma.UserCreateInput = req.body;

  try {
    // Check if the name or email already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{name}, {email}],
      },
    });

    if (existingUser) {
      return res.status(400).json({message: 'Name or email already exists'});
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    // Generate tokens
    const payload = {id: user.id, name: user.name, email: user.email};
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_ACCESS_SECRET as string,
      {expiresIn: '15m'}
    );
    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET as string,
      {expiresIn: '7d'}
    );

    res.status(201).json({
      message: 'User created successfully',
      userId: user.id,
      access_token: `Bearer ${accessToken}`,
      refresh_token: refreshToken,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({message: 'Something went wrong. Please try again.'});
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const {email, password} = req.body;
    const user = await prisma.user.findUnique({where: {email}});

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({message: 'Invalid credentials'});
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    const accessToken = jwt.sign(
      payload,
      process.env.JWT_ACCESS_SECRET as string,
      {expiresIn: '15m'}
    );
    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET as string,
      {expiresIn: '7d'}
    );

    return res.json({
      message: 'Logged in successfully!',
      access_token: `Bearer ${accessToken}`,
      refresh_token: refreshToken,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({error: 'Error logging in'});
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  const refreshToken =
    authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;

  if (!refreshToken) {
    return res.status(400).json({message: 'Refresh token is required'});
  }

  try {
    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string
    ) as any;
    const accessToken = jwt.sign(
      {id: payload.id, name: payload.name, email: payload.email},
      process.env.JWT_ACCESS_SECRET as string,
      {expiresIn: '15m'}
    );

    return res.json({
      access_token: `Bearer ${accessToken}`,
    });
  } catch (error) {
    return res.status(401).json({message: 'Invalid refresh token'});
  }
};

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {id: true, name: true, email: true},
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({error: 'Error fetching users'});
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const {id} = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: {id},
      select: {id: true, name: true, email: true},
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({error: 'User not found'});
    }
  } catch (error) {
    res.status(500).json({error: 'Error fetching user'});
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const {id} = req.params;
  const {name, email}: Prisma.UserUpdateInput = req.body;

  try {
    // Check if the user exists
    const existingUser = await prisma.user.findUnique({
      where: {id},
    });

    if (!existingUser) {
      return res.status(404).json({error: 'User not found'});
    }

    const updatedUser = await prisma.user.update({
      where: {id},
      data: {name, email},
      select: {id: true, name: true, email: true},
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        res.status(400).json({error: 'Name or email already exists'});
      } else {
        res.status(500).json({error: 'Error updating user'});
      }
    } else {
      res.status(500).json({error: 'Error updating user'});
    }
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const {id} = req.params;
  try {
    await prisma.user.delete({where: {id}});
    res.json({message: 'User deleted successfully'});
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        res.status(404).json({error: 'User not found'});
      } else {
        res.status(500).json({error: 'Error deleting user'});
      }
    } else {
      res.status(500).json({error: 'Error deleting user'});
    }
  }
};
