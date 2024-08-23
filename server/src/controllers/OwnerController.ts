import {Request, Response} from 'express';
import {PrismaClient, Prisma} from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {z} from 'zod';
import {uploadToCloudinary, removeFromCloudinary} from '../services/Cloudinary';
import { buildAbility } from '../config/caslAbility';

const prisma = new PrismaClient();

const withdrawSchema = z.object({
  amount: z.number().positive(),
});

export const registerOwner = async (req: Request, res: Response) => {
  const {
    name,
    email,
    password,
    location,
    phoneNumber,
    profileImage,
    wallet,
  }: Prisma.OwnerCreateInput = req.body;
  phoneNumber;

  try {
    const existingOwner = await prisma.owner.findFirst({
      where: {
        OR: [{name}, {email}],
      },
    });

    if (existingOwner) {
      return res.status(400).json({message: 'Name or email already exists'});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const owner = await prisma.owner.create({
      data: {
        name,
        email,
        password: hashedPassword,
        location,
        phoneNumber,
        profileImage,
        wallet: {
          create: {balance: 0},
        },
      },
    });
    const payload = {id: owner.id, name: owner.name, email: owner.email};
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
        id: owner.id,
        name: owner.name,
        email: owner.email,
        role: 'OWNER',
        phoneNumber: owner.phoneNumber,
        profileImage: owner.profileImage,
      },
      roles: ['OWNER'],
      access_token: `Bearer ${accessToken}`,
      refresh_token: refreshToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Something went wrong. Please try again.'});
  }
};

export const loginOwner = async (req: Request, res: Response) => {
  try {
    const {email, password} = req.body;
    const owner = await prisma.owner.findUnique({where: {email}});

    if (!owner || !bcrypt.compareSync(password, owner.password)) {
      return res.status(401).json({message: 'Invalid credentials'});
    }

    const payload = {
      id: owner.id,
      name: owner.name,
      email: owner.email,
      role: 'OWNER', // Explicitly set the role
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

    res.status(200).json({
      user: {
        id: owner.id,
        name: owner.name,
        email: owner.email,
        role: 'OWNER',
        phoneNumber: owner.phoneNumber,
        profileImage: owner.profileImage,
      },
      roles: ['OWNER'],
      access_token: `Bearer ${accessToken}`,
      refresh_token: refreshToken,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({error: 'Error logging in'});
  }
};

export const createBook = async (req: Request, res: Response) => {
  const ability = buildAbility((req as any).user.role);
  
  if (ability.can('create', 'Book')) {
  const {
    title,
    author,
    description,
    category,
    availableQuantity,
    price,
    quantity,
  } = req.body;

  const ownerId = (req as any).user.id;
  const coverImage = req.file;

  if (!coverImage) {
    return res.status(400).json({error: 'Cover image is required'});
  }

  try {
    const owner = await prisma.owner.findUnique({where: {id: ownerId}});

    if (!owner) {
      return res.status(404).json({error: 'Owner not found'});
    }

    if (owner.status === 'INACTIVE') {
      return res
        .status(403)
        .json({message: 'Account not activated. Please contact admin.'});
    }

    const cloudinaryResult = await uploadToCloudinary(
      coverImage.path,
      'book-covers'
    );

    const book = await prisma.book.create({
      data: {
        title,
        author,
        coverImage: cloudinaryResult.secure_url,
        description,
        category: {connect: {id: Number(category)}},
        availableQuantity: Number(availableQuantity),
        price: Number(price),
        quantity: Number(quantity),
        owner: {connect: {id: ownerId}},
        status: 'PENDING',
        reviewCount: 0,
        rating: 0,
      },
    });

    res.status(201).json({
      message: 'Book created successfully. Awaiting admin approval.',
      bookId: book.id,
      book: book,
    });
  } catch (error) {
    console.error('Error creating book:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return res
          .status(400)
          .json({error: 'A book with this title already exists'});
      }
      if (error.code === 'P2025') {
        return res.status(400).json({error: 'Invalid category'});
      }
    }
    res.status(500).json({error: 'Error creating book'});
    }
  } else {
    res.status(403).json({ error: "Unauthorized to create a book" });
  }
};

export const updateBook = async (req: Request, res: Response) => {
  const ability = buildAbility((req as any).user.role);
  
  if (ability.can('update', 'Book')) {
  const {bookId} = req.params;
  const {
    title,
    author,
    category,
    availableQuantity,
    price,
    quantity,
    reviewCount,
    rating,
  } = req.body;

  const ownerId = (req as any).user.id;
  const coverImage = req.file;

  if (!ownerId) {
    return res.status(400).json({error: 'Owner ID is required'});
  }

  try {
    const owner = await prisma.owner.findUnique({where: {id: ownerId}});

    if (!owner) {
      return res.status(404).json({error: 'Owner not found'});
    }

    if (owner.status === 'INACTIVE') {
      return res
        .status(403)
        .json({message: 'Account not activated. Please contact admin.'});
    }

    const existingBook = await prisma.book.findUnique({
      where: {id: Number(bookId)},
    });

    if (!existingBook) {
      return res.status(404).json({error: 'Book not found'});
    }

    let coverImageUrl = existingBook.coverImage;

    if (coverImage) {
      const cloudinaryResult = await uploadToCloudinary(
        coverImage.path,
        'book-covers'
      );
      coverImageUrl = cloudinaryResult.secure_url;

      // Remove the old cover image from Cloudinary
      if (existingBook.coverImage) {
        const publicId = existingBook.coverImage
          .split('/')
          .pop()
          ?.split('.')[0];
        if (publicId) {
          await removeFromCloudinary(publicId);
        }
      }
    }

    const updatedBook = await prisma.book.update({
      where: {id: Number(bookId), ownerId: ownerId},
      data: {
        title: title || undefined,
        author: author || undefined,
        coverImage: coverImageUrl,
        category: category ? {connect: {id: Number(category)}} : undefined,
        availableQuantity: availableQuantity
          ? Number(availableQuantity)
          : undefined,
        price: price ? Number(price) : undefined,
        quantity: quantity ? Number(quantity) : undefined,
        status: 'PENDING',
        reviewCount: reviewCount ? Number(reviewCount) : undefined,
        rating: rating ? Number(rating) : undefined,
      },
    });

    res.status(200).json({
      message: 'Book updated successfully. Awaiting admin approval.',
      book: updatedBook,
    });
  } catch (error) {
    console.error('Error updating book:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return res
          .status(404)
          .json({error: 'Book not found or not owned by this owner'});
      }
    }
    res.status(500).json({error: 'Error updating book'});
    }
  } else {
    res.status(403).json({ error: "Unauthorized to update a book" });
  }
};

export const getAllOwnerBooks = async (req: Request, res: Response) => {
  const ability = buildAbility((req as any).user.role);
  
  if (ability.can('read', 'OwnerBooks')) {
  const ownerId = (req as any).user.id;

  try {
    const owner = await prisma.owner.findUnique({
      where: {id: ownerId},
      include: {
        books: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!owner) {
      return res.status(404).json({error: 'Owner not found'});
    }

    const formattedBooks = owner.books.map((book) => ({
      ...book,
      categoryName: book.category?.name || 'Uncategorized',
    }));

    res.json(formattedBooks);
  } catch (error) {
    console.error('Error fetching owner books:', error);
    res.status(500).json({error: 'Error fetching owner books'});
    }
  } else {
    res.status(403).json({ error: "Unauthorized to view owner books" });
  }
};

export const getFilteredOwnerBooks = async (req: Request, res: Response) => {
  const ability = buildAbility((req as any).user.role);
  
  if (ability.can('read', 'OwnerBooks')) {
  const { search, id, title, author, category, status } = req.query;
  const ownerId = (req as any).user.id;

  try {
    let query: Prisma.BookWhereInput = { ownerId };

    if (search) {
      query.OR = [
        { title: { contains: search as string, mode: "insensitive" } },
        { author: { contains: search as string, mode: "insensitive" } },
        { category: { name: { contains: search as string, mode: "insensitive" } } },
      ];
    }

    if (id) query.id = { equals: parseInt(id as string) };
    if (title) query.title = { contains: title as string, mode: "insensitive" };
    if (author) query.author = { contains: author as string, mode: "insensitive" };
    if (category) query.category = { name: { contains: category as string, mode: "insensitive" } };
    if (status) query.status = status as Prisma.EnumBookStatusFilter;

    const books = await prisma.book.findMany({
      where: query,
      include: { category: true },
      orderBy: { title: "asc" },
    });

    res.json(books);
  } catch (error) {
    console.error("Error fetching filtered owner books:", error);
    res.status(500).json({ error: "Error fetching filtered owner books" });
    }
  } else {
    res.status(403).json({ error: "Unauthorized to view filtered owner books" });
  }
};

export const getAllOwnerBooksById = async (req: Request, res: Response) => {
  const ability = buildAbility((req as any).user.role);
  
  if (ability.can('read', 'OwnerBooks')) {
  const {bookId} = req.params;
  const ownerId = (req as any).user.id;

  try {
    const owner = await prisma.owner.findUnique({
      where: {id: ownerId},
      include: {books: true},
    });

    if (!owner) {
      return res.status(404).json({error: 'Owner not found'});
    }

    const book = owner.books.find((b) => b.id === Number(bookId));

    if (!book) {
      return res
        .status(404)
        .json({error: 'Book not found or not owned by this owner'});
    }

    res.json(book);
  } catch (error) {
    console.error('Error fetching owner book:', error);
    res.status(500).json({error: 'Error fetching owner book'});
    }
  } else {
    res.status(403).json({ error: "Unauthorized to view owner book" });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  const ability = buildAbility((req as any).user.role);
  
  if (ability.can('delete', 'Book')) {
  const {bookId} = req.params;
  const ownerId = (req as any).user.id;

  try {
    const owner = await prisma.owner.findUnique({
      where: {id: ownerId},
      include: {books: true},
    });

    if (!owner) {
      return res.status(404).json({error: 'Owner not found'});
    }

    const book = owner.books.find((b) => b.id === Number(bookId));

    if (!book) {
      return res
        .status(404)
        .json({error: 'Book not found or not owned by this owner'});
    }

    await prisma.book.delete({
      where: {id: Number(bookId)},
    });

    res.json({message: 'Book deleted successfully'});
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({error: 'Error deleting book'});
    }
  } else {
    res.status(403).json({ error: "Unauthorized to delete a book" });
  }
};

export const getOwnerBalance = async (req: Request, res: Response) => {
  const ability = buildAbility((req as any).user.role);
  
  if (ability.can('read', 'OwnerWallet')) {
  const ownerId = (req as any).user.id;

  try {
    const ownerWallet = await prisma.ownerWallet.findUnique({where: {ownerId}});

    if (!ownerWallet) {
      return res.status(404).json({error: 'Wallet not found'});
    }

    res.json({balance: ownerWallet.balance});
  } catch (error) {
    console.error('Error fetching owner wallet balance:', error);
    res.status(500).json({error: 'Error fetching owner wallet balance'});
    }
  } else {
    res.status(403).json({ error: "Unauthorized to view owner wallet balance" });
  }
};

export const ownerWithdraw = async (req: Request, res: Response) => {
  const ability = buildAbility((req as any).user.role);
  
  if (ability.can('update', 'OwnerWallet')) {
  const ownerId = (req as any).user.id;
  const {amount} = withdrawSchema.parse(req.body);

  try {
    const ownerWallet = await prisma.ownerWallet.findUnique({where: {ownerId}});

    if (!ownerWallet || ownerWallet.balance < amount) {
      return res.status(400).json({error: 'Insufficient funds'});
    }

    const updatedWallet = await prisma.ownerWallet.update({
      where: {ownerId},
      data: {balance: {decrement: amount}},
    });

    res.json({
      message: 'Withdrawal successful',
      balance: updatedWallet.balance,
    });
  } catch (error) {
    console.error('Error withdrawing funds:', error);
    res.status(500).json({error: 'Error withdrawing funds'});
    }
  } else {
    res.status(403).json({ error: "Unauthorized to withdraw funds" });
  }
};

export const ownerLogout = async (req: Request, res: Response) => {
  try {
    //TODO invalidate the token on the server-side

    res.status(200).json({message: 'Logged out successfully'});
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({error: 'Error logging out'});
  }
};

export const getCategories = async (req: Request, res: Response) => {
  const ability = buildAbility((req as any).user.role);
  
  if (ability.can('read', 'Category')) {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({error: 'Error fetching categories'});
    }
  } else {
    res.status(403).json({ error: "Unauthorized to view categories" });
  }
};
