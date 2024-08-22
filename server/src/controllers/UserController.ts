import {Request, Response} from 'express';
import {PrismaClient, Prisma, Role} from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  const {
    name,
    email,
    password,
    phoneNumber,
    profileImage,
    wallet,
  }: Prisma.UserCreateInput = req.body;

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{name}, {email}],
      },
    });

    if (existingUser) {
      return res.status(400).json({message: 'Name or email already exists'});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: Role.USER,
        phoneNumber,
        profileImage,
        wallet: {
          create: {balance: 100},
        },
      },
    });

    const payload = {id: user.id, name: user.name, email: user.email};
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_ACCESS_SECRET as string,

      {expiresIn: '48h'}
    );
    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET as string,
      {expiresIn: '7d'}
    );

    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        profileImage: user.profileImage,
      },
      roles: [user.role],
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

    if (
      !user ||
      !bcrypt.compareSync(password, user.password) ||
      user.role === 'ADMIN'
    ) {
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
      {expiresIn: '48h'}
    );
    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET as string,
      {expiresIn: '7d'}
    );

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        profileImage: user.profileImage,
      },
      roles: [user.role],
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
      {expiresIn: '48h'}
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
      where: {
        role: 'USER',
      },
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
  const id = (req as any).userId;
  const updateData: Prisma.UserUpdateInput = req.body;
  const requestingUserId = (req as any).userId;
  const requestingUserRole = await getUserRole(requestingUserId);

  try {
    if (requestingUserId !== id && requestingUserRole !== 'ADMIN') {
      return res.status(403).json({error: 'Unauthorized to update this user'});
    }

    // Check if the user exists
    const existingUser = await prisma.user.findUnique({
      where: {id},
    });

    if (!existingUser) {
      return res.status(404).json({error: 'User not found'});
    }

    const updatedUser = await prisma.user.update({
      where: {id},
      data: updateData,
      select: {id: true, name: true, email: true, role: true},
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
  const requestingUserId = (req as any).userId;
  const requestingUserRole = await getUserRole(requestingUserId);

  try {
    if (requestingUserId !== id && requestingUserRole !== 'ADMIN') {
      return res.status(403).json({error: 'Unauthorized to update this user'});
    }
    await prisma.user.delete({where: {id}});
    res.json({message: 'User deleted successfully'});
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        res.status(404).json({error: 'User not found'});
      } else {
        res.status(500).json({error: 'Error 2 deleting user'});
      }
    } else {
      res.status(500).json({error: 'Error  deleting user '});
    }
  }
};
// Helper function to get user role
async function getUserRole(
  userId: string | undefined
): Promise<string | undefined> {
  const user = await prisma.user.findUnique({where: {id: userId}});
  return user?.role || '';
}

// Get available books
export const getAvailableBooks = async (req: Request, res: Response) => {
  try {
    console.log('Fetching available books...');
    const availableBooks = await prisma.book.findMany({
      where: {
        status: 'APPROVED',
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
        owner: {
          select: {
            name: true,
            location: true,
          },
        },
      },
    });

    console.log('Available books:', availableBooks);

    if (availableBooks.length === 0) {
      return res.status(404).json({message: 'No available books found'});
    }

    const formattedBooks = availableBooks.map((book) => ({
      id: book.id,
      title: book.title,
      author: book.author,
      coverImage: book.coverImage,
      description: book.description,
      category: book.category.name,
      availableQuantity: book.availableQuantity,
      price: book.price,
      rating: book.rating,
      reviewCount: book.reviewCount,
      ownerName: book.owner?.name || 'Unknown',
      ownerLocation: book.owner?.location || 'Unknown',
    }));

    res.json(formattedBooks);
  } catch (error) {
    console.error('Error fetching available books:', error);
    res
      .status(500)
      .json({error: 'Error fetching available books', details: error});
  }
};
// get book detail
export const getBookDetailById = async (req: Request, res: Response) => {
  const {bookId} = req.params;

  try {
    const book = await prisma.book.findFirst({
      where: {
        id: parseInt(bookId),
        status: 'APPROVED',
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
        owner: {
          select: {
            name: true,
            location: true,
          },
        },
      },
    });

    if (!book) {
      return res.status(404).json({message: 'Book not found'});
    }

    const formattedBook = {
      id: book.id,
      title: book.title,
      author: book.author,
      coverImage: book.coverImage,
      description: book.description,
      category: book.category.name,
      availableQuantity: book.availableQuantity,
      price: book.price,
      rating: book.rating,
      reviewCount: book.reviewCount,
      ownerName: book.owner.name,
      ownerLocation: book.owner.location,
    };

    res.json(formattedBook);
  } catch (error) {
    console.error('Error fetching book detail:', error);
    res.status(500).json({error: 'Error fetching book detail'});
  }
};

// log Out
export const logout = async (req: Request, res: Response) => {
  try {
    //TODO:  invalidate the token on the server-side
    res.status(200).json({message: 'Logged out successfully'});
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({error: 'Error logging out'});
  }
};

// get all books from category
export const getBooksFromCategory = async (req: Request, res: Response) => {
  const {categoryId} = req.params;

  if (!categoryId || isNaN(parseInt(categoryId))) {
    return res.status(400).json({error: 'Invalid category ID'});
  }

  try {
    const books = await prisma.book.findMany({
      where: {
        categoryId: parseInt(categoryId),
        status: 'APPROVED',
        availableQuantity: {
          gt: 0,
        },
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
        owner: {
          select: {
            name: true,
            location: true,
          },
        },
      },
    });

    if (books.length === 0) {
      return res.status(404).json({message: 'No books found in this category'});
    }

    const formattedBooks = books.map((book) => ({
      id: book.id,
      title: book.title,
      author: book.author,
      coverImage: book.coverImage,
      description: book.description,
      category: book.category.name,
      availableQuantity: book.availableQuantity,
      price: book.price,
      rating: book.rating,
      reviewCount: book.reviewCount,
      ownerName: book.owner.name,
      ownerLocation: book.owner.location,
    }));

    res.json(formattedBooks);
  } catch (error) {
    console.error('Error fetching books from category:', error);
    res.status(500).json({error: 'Error fetching books from category'});
  }
};

// get all categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    res.status(500).json({error: 'Error fetching categories'});
  }
};

// search book
export const searchBooks = async (req: Request, res: Response) => {
  const { query } = req.query;

  try {
    const books = await prisma.book.findMany({
      where: {
        OR: [
          { title: { contains: query as string, mode: 'insensitive' } },
          { author: { contains: query as string, mode: 'insensitive' } },
          { category: { name: { contains: query as string, mode: 'insensitive' } } },
        ],
        status: 'APPROVED',
        // availableQuantity: { gt: 0 },
      },
      include: {
        category: { select: { name: true } },
        owner: { select: { name: true, location: true } },
      },
    });

    const formattedBooks = books.map((book) => ({
      id: book.id,
      title: book.title,
      author: book.author,
      coverImage: book.coverImage,
      description: book.description,
      category: book.category.name,
      availableQuantity: book.availableQuantity,
      price: book.price,
      rating: book.rating,
      reviewCount: book.reviewCount,
      ownerName: book.owner.name,
      ownerLocation: book.owner.location,
    }));

    res.json(formattedBooks);
  } catch (error) {
    console.error('Error searching books:', error);
    res.status(500).json({ error: 'Error searching books' });
  }
};