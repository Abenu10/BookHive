import {Request, Response} from 'express';
import {PrismaClient} from '@prisma/client';
import {z} from 'zod';
import {WithRetry} from '../utils/PrismaRetry';

const prisma = new PrismaClient();
// ! TODO: we need to include the status
const createRentalSchema = z.object({
  bookId: z.number().int().positive(),
  userId: z.string().uuid(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  status: z.enum(['ACTIVE', 'RETURNED', 'OVERDUE']).default('ACTIVE'),
});

export const createRental = async (req: Request, res: Response) => {
  const rentalData = createRentalSchema.parse(req.body);
  const tokenUserId = (req as any).userId;

  if (rentalData.userId !== tokenUserId) {
    return res
      .status(403)
      .json({error: 'Unauthorized: You can only create rentals for yourself'});
  }

  try {
    const result = await WithRetry(() =>
      prisma.$transaction(async (prisma) => {
        const book = await prisma.book.findUnique({
          where: {id: rentalData.bookId},
          include: {owner: true},
        });

        if (!book) {
          throw new Error('Book not found');
        }

        if (book.status === 'PENDING') {
          throw new Error(
            'Book is pending approval and cannot be rented at this time'
          );
        }

        if (book.status !== 'APPROVED') {
          throw new Error('Book is not available for rent');
        }

        if (book.availableQuantity < 1) {
          throw new Error(
            'No copies of this book are currently available for rent'
          );
        }

        const renterWallet = await prisma.wallet.findUnique({
          where: {userId: rentalData.userId},
        });

        if (!renterWallet || renterWallet.balance < book.price) {
          throw new Error('Insufficient funds');
        }

        // Decrement renter's wallet
        await prisma.wallet.update({
          where: {userId: rentalData.userId},
          data: {balance: {decrement: book.price}},
        });

        // Increment book owner's wallet
        await prisma.ownerWallet.upsert({
          where: {ownerId: book.owner.id},
          update: {balance: {increment: book.price}},
          create: {ownerId: book.owner.id, balance: book.price},
        });

        // Create rental
        // Create rental
        const rental = await prisma.rental.create({
          data: {
            book: {connect: {id: rentalData.bookId}},
            user: {connect: {id: rentalData.userId}},
            startDate: new Date(rentalData.startDate),
            endDate: new Date(rentalData.endDate),
            status: rentalData.status,
          },
        });

        // Update book availability
        await prisma.book.update({
          where: {id: rentalData.bookId},
          data: {availableQuantity: {decrement: 1}},
        });

        return rental;
      })
    );

    res
      .status(201)
      .json({message: 'Rental created successfully', rental: result});
  } catch (error) {
    console.error('Error creating rental:', error);
    res.status(500).json({error: 'Error creating rental'});
  }
};

export const getRental = async (req: Request, res: Response) => {
  const {rentalId} = req.params;

  try {
    const rental = await prisma.rental.findUnique({
      where: {id: parseInt(rentalId)},
      include: {book: true, user: true},
    });

    if (!rental) {
      return res.status(404).json({error: 'Rental not found'});
    }

    res.json(rental);
  } catch (error) {
    console.error('Error fetching rental:', error);
    res.status(500).json({error: 'Error fetching rental'});
  }
};

export const returnRental = async (req: Request, res: Response) => {
  const {rentalId} = req.params;

  try {
    const rental = await prisma.rental.findUnique({
      where: {id: parseInt(rentalId)},
    });

    if (!rental) {
      return res.status(404).json({error: 'Rental not found'});
    }

    const updatedRental = await prisma.rental.update({
      where: {id: parseInt(rentalId)},
      data: {status: 'RETURNED'},
    });

    await prisma.book.update({
      where: {id: rental.bookId},
      data: {availableQuantity: {increment: 1}},
    });

    res.json({message: 'Book returned successfully', rental: updatedRental});
  } catch (error) {
    console.error('Error returning rental:', error);
    res.status(500).json({error: 'Error returning rental'});
  }
};

export const getUserRentals = async (req: Request, res: Response) => {
  const {userId} = req.params;

  try {
    const rentals = await prisma.rental.findMany({
      where: {userId},
      include: {book: true},
    });

    res.json(rentals);
  } catch (error) {
    console.error('Error fetching user rentals:', error);
    res.status(500).json({error: 'Error fetching user rentals'});
  }
};
export const isBookRentedByUser = async (req: Request, res: Response) => {
  const {userId, bookId} = req.params;

  try {
    const rental = await prisma.rental.findFirst({
      where: {
        userId,
        bookId: parseInt(bookId),
        status: 'ACTIVE',
      },
    });

    res.json({isRented: !!rental});
  } catch (error) {
    console.error('Error checking if book is rented:', error);
    res.status(500).json({error: 'Error checking if book is rented'});
  }
};

export const toggleRentalStatus = async (req: Request, res: Response) => {
  const {userId, bookId} = req.params;

  try {
    const result = await prisma.$transaction(async (prisma) => {
      const book = await prisma.book.findUnique({
        where: {id: parseInt(bookId)},
      });

      if (!book) {
        throw new Error('Book not found');
      }

      const existingRental = await prisma.rental.findFirst({
        where: {
          userId,
          bookId: parseInt(bookId),
          status: 'ACTIVE',
        },
      });

      if (existingRental) {
        // Return the book
        await prisma.rental.update({
          where: {id: existingRental.id},
          data: {status: 'RETURNED', endDate: new Date()},
        });
        await prisma.book.update({
          where: {id: parseInt(bookId)},
          data: {availableQuantity: {increment: 1}},
        });
        return {isRented: false, message: 'Book returned successfully'};
      } else {
        // Rent the book
        if (book.availableQuantity < 1) {
          throw new Error(
            'No copies of this book are currently available for rent'
          );
        }
        await prisma.rental.create({
          data: {
            userId,
            bookId: parseInt(bookId),
            startDate: new Date(),
            endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
            status: 'ACTIVE',
          },
        });
        await prisma.book.update({
          where: {id: parseInt(bookId)},
          data: {availableQuantity: {decrement: 1}},
        });
        return {isRented: true, message: 'Book rented successfully'};
      }
    });

    res.json(result);
  } catch (error) {
    console.error('Error toggling rental status:', error);
    res.status(500).json({error: 'Error toggling rental status'});
  }
};
