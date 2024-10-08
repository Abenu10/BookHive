import {Request, Response} from "express";
import {PrismaClient, Prisma, Role} from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { buildAbility } from '../config/caslAbility';

const prisma = new PrismaClient();

export const registerAdmin = async (req: Request, res: Response) => {
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
      return res.status(400).json({message: "Name or email already exists"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: Role.ADMIN,
        phoneNumber,
        profileImage,
        wallet: {
          create: {balance: 100},
        },
      },
    });

    const payload = {id: user.id, name: user.name, email: user.email, role: user.role};
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_ACCESS_SECRET as string,

      {expiresIn: "48h"}
    );
    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET as string,
      {expiresIn: "7d"}
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
    res.status(500).json({message: "Something went wrong. Please try again."});
  }
};

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const {email, password} = req.body;
    const user = await prisma.user.findUnique({where: {email}});

    if (
      !user ||
      !bcrypt.compareSync(password, user.password) ||
      user.role !== Role.ADMIN
    ) {
      return res.status(401).json({message: "Invalid credentials"});
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(
      payload,
      process.env.JWT_ACCESS_SECRET as string,
      {expiresIn: "48h"}
    );
    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET as string,
      {expiresIn: "7d"}
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
    console.error("Login error:", error);
    res.status(500).json({error: "Error logging in"});
  }
};

// Get all owners
export const getAllOwners = async (req: Request, res: Response) => {
  const ability = buildAbility((req as any).user.role);
  
  if (ability.can('read', 'Owners')) {
    try {
      const owners = await prisma.owner.findMany();
      res.json(owners);
    } catch (error) {
      console.error("Error fetching owners:", error);
      res.status(500).json({error: "Error fetching owners"});
    }
  } else {
    res.status(403).json({ error: "Unauthorized to view owners" });
  }
};

export const toggleOwnerStatus = async (req: Request, res: Response) => {
  const ability = buildAbility((req as any).user.role);
  
  if (ability.can('update', 'toggleOwner')) {
    const {ownerId} = req.params;
    try {
      const owner = await prisma.owner.findUnique({
        where: {id: ownerId},
      });

      if (!owner) {
        return res.status(404).json({error: "Owner not found"});
      }

      const newStatus = owner.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

      const updatedOwner = await prisma.owner.update({
        where: {id: ownerId},
        data: {status: newStatus},
      });

      res.json({
        message: `Owner account ${newStatus.toLowerCase()}`,
        ownerId: updatedOwner.id,
        status: updatedOwner.status,
      });
    } catch (error) {
      console.error("Error toggling owner status:", error);
      res.status(500).json({error: "Error updating owner account status"});
    }
  } else {
    res.status(403).json({ error: "Unauthorized to toggle owner status" });
  }
};

export const toggleBookStatus = async (req: Request, res: Response) => {
  const ability = buildAbility((req as any).user.role);
  
  if (ability.can('update', 'toggleBook')) {
    const {bookId} = req.params;
    try {
      const book = await prisma.book.findUnique({
        where: {id: parseInt(bookId)},
      });

      if (!book) {
        return res.status(404).json({error: "Book not found"});
      }

      const newStatus = book.status === "APPROVED" ? "PENDING" : "APPROVED";

      const updatedBook = await prisma.book.update({
        where: {id: parseInt(bookId)},
        data: {status: newStatus},
      });

      res.json({
        message: `Book status changed to ${newStatus.toLowerCase()}`,
        bookId: updatedBook.id,
        status: updatedBook.status,
      });
    } catch (error) {
      console.error("Error toggling book status:", error);
      res.status(500).json({error: "Error updating book status"});
    }
  } else {
    res.status(403).json({ error: "Unauthorized to toggle book status" });
  }
};

// Get all books for admin dashboard
export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const books = await prisma.book.findMany({
      include: {owner: true, category: true},
    });
    const formattedBooks = books.map((book) => ({
      ...book,
      categoryName: book.category?.name || "Uncategoriezed",
    }));

    res.json(formattedBooks);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({error: "Error fetching books"});
  }
};

export const getFilteredBooks = async (req: Request, res: Response) => {
  const { search, id, title, author, category, owner, ownerLocation, status } = req.query;

  try {
    let query: Prisma.BookWhereInput = {};

    if (search) {
      query.OR = [
        { title: { contains: search as string, mode: "insensitive" } },
        { author: { contains: search as string, mode: "insensitive" } },
        { owner: { name: { contains: search as string, mode: "insensitive" } } },
        { category: { name: { contains: search as string, mode: "insensitive" } } },
      ];
    }

    if (id) query.id = { equals: parseInt(id as string) };
    if (title) query.title = { contains: title as string, mode: "insensitive" };
    if (author) query.author = { contains: author as string, mode: "insensitive" };
    if (category) query.category = { name: { contains: category as string, mode: "insensitive" } };
    if (owner) query.owner = { name: { contains: owner as string, mode: "insensitive" } };
    if (ownerLocation) query.owner = { location: { contains: ownerLocation as string, mode: "insensitive" } };
    if (status) query.status = status as Prisma.EnumBookStatusFilter;

    const books = await prisma.book.findMany({
      where: query,
      include: { owner: true, category: true },
      orderBy: { title: "asc" },
    });

    const formattedBooks = books.map((book) => ({
      ...book,
      categoryName: book.category?.name || "Uncategorized",
      ownerLocation: book.owner.location,
    }));

    res.json(formattedBooks);
  } catch (error) {
    console.error("Error fetching filtered books:", error);
    res.status(500).json({ error: "Error fetching filtered books" });
  }
};



// deletee book
export const deleteBook = async (req: Request, res: Response) => {
  const {bookId} = req.params;
  const userId = (req as any).userId;

  if (!userId) {
    return res.status(400).json({error: "Owner ID is required"});
  }

  try {
    const book = await prisma.book.findUnique({
      where: {id: parseInt(bookId)},
      include: {owner: true},
    });

    if (!book) {
      return res.status(404).json({error: "Book not found"});
    }

    await prisma.book.delete({
      where: {id: parseInt(bookId)},
    });

    res.json({
      message: "Book deleted successfully",
      deletedBook: {
        id: book.id,
        title: book.title,
        author: book.author,
        ownerName: book.owner.name,
      },
    });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({error: "Error deleting book"});
  }
};

// create category
export const createCategory = async (req: Request, res: Response) => {
  const ability = buildAbility((req as any).user.role);
  
  if (ability.can('create', 'Category')) {
    const categoryData: Prisma.CategoryCreateInput = req.body;
    try {
      const existingCategory = await prisma.category.findUnique({
        where: {name: categoryData.name},
      });

      if (existingCategory) {
        return res.status(400).json({
          message: "A category with this name already exists",
          categoryId: existingCategory.id,
        });
      }
      const category = await prisma.category.create({
        data: categoryData,
      });

      res.status(201).json({
        message: "Category created successfully",
        categoryId: category.id,
      });
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({error: "Error creating category"});
    }
  } else {
    res.status(403).json({ error: "Unauthorized to create category" });
  }
};
// delete category
export const deleteCategory = async (req: Request, res: Response) => {
  const ability = buildAbility((req as any).user.role);
  
  if (ability.can('delete', 'Category')) {
    const {id} = req.params;
    try {
      // Check if there are any books associated with this category
      const booksInCategory = await prisma.book.count({
        where: {categoryId: parseInt(id)},
      });

      if (booksInCategory > 0) {
        return res.status(400).json({
          error:
            "Cannot delete category. There are books associated with this category.",
        });
      }

      await prisma.category.delete({
        where: {id: parseInt(id)},
      });
      res.json({message: "Category deleted successfully"});
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({error: "Error deleting category"});
    }
  } else {
    res.status(403).json({ error: "Unauthorized to delete category" });
  }
};

// update Admn
export const updateAdmin = async (req: Request, res: Response) => {
  const id = (req as any).userId;
  const updateData: Prisma.UserUpdateInput = req.body;

  try {
    const existingUser = await prisma.user.findUnique({where: {id}});

    if (!existingUser || existingUser.role !== Role.ADMIN) {
      return res.status(403).json({message: "Forbidden"});
    }

    if (!existingUser) {
      return res.status(404).json({error: "User not found"});
    }

    const updatedUser = await prisma.user.update({
      where: {id},
      data: updateData,
      select: {id: true, name: true, email: true, role: true},
    });

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating admin:", error);
    res.status(500).json({error: "Error updating admin"});
  }
};
// delete admin
export const deleteAdmin = async (req: Request, res: Response) => {
  const {id} = req.params;

  try {
    await prisma.wallet.delete({where: {userId: id}});
    await prisma.user.delete({where: {id}});

    res.json({message: "Admin deleted successfully"});
  } catch (error) {
    console.error("Error deleting admin:", error);
    res.status(500).json({error: "Error deleting admin"});
  }
};
// get flterd owners
export const getFilteredOwners = async (req: Request, res: Response) => {
  const { search, id, email, name, phoneNumber, location, status } = req.query;

  try {
    let query: Prisma.OwnerWhereInput = {};

    if (search) {
      query.OR = [
        { name: { contains: search as string, mode: "insensitive" } },
        { email: { contains: search as string, mode: "insensitive" } },
      ];
    }

    if (id) query.id = { equals: id as string };
    if (email) query.email = { contains: email as string, mode: "insensitive" };
    if (name) query.name = { contains: name as string, mode: "insensitive" };
    if (phoneNumber) query.phoneNumber = { contains: phoneNumber as string, mode: "insensitive" };
    if (location) query.location = { contains: location as string, mode: "insensitive" };
    if (status) query.status = status as Prisma.EnumOwnerStatusFilter;

    const owners = await prisma.owner.findMany({
      where: query,
      orderBy: { name: "asc" },
    });

    res.json(owners);
  } catch (error) {
    console.error("Error fetching filtered owners:", error);
    res.status(500).json({ error: "Error fetching filtered owners" });
  }
};