"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleRentalStatus = exports.isBookRentedByUser = exports.getUserRentals = exports.returnRental = exports.getRental = exports.createRental = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const PrismaRetry_1 = require("../utils/PrismaRetry");
const prisma = new client_1.PrismaClient();
// ! TODO: we need to include the status
const createRentalSchema = zod_1.z.object({
    bookId: zod_1.z.number().int().positive(),
    userId: zod_1.z.string().uuid(),
    startDate: zod_1.z.string().datetime(),
    endDate: zod_1.z.string().datetime(),
    status: zod_1.z.enum(['ACTIVE', 'RETURNED', 'OVERDUE']).default('ACTIVE'),
});
const createRental = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rentalData = createRentalSchema.parse(req.body);
    const tokenUserId = req.userId;
    if (rentalData.userId !== tokenUserId) {
        return res
            .status(403)
            .json({ error: 'Unauthorized: You can only create rentals for yourself' });
    }
    try {
        const result = yield (0, PrismaRetry_1.WithRetry)(() => prisma.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            const book = yield prisma.book.findUnique({
                where: { id: rentalData.bookId },
                include: { owner: true },
            });
            if (!book) {
                throw new Error('Book not found');
            }
            if (book.status === 'PENDING') {
                throw new Error('Book is pending approval and cannot be rented at this time');
            }
            if (book.status !== 'APPROVED') {
                throw new Error('Book is not available for rent');
            }
            if (book.availableQuantity < 1) {
                throw new Error('No copies of this book are currently available for rent');
            }
            const renterWallet = yield prisma.wallet.findUnique({
                where: { userId: rentalData.userId },
            });
            if (!renterWallet || renterWallet.balance < book.price) {
                throw new Error('Insufficient funds');
            }
            // Decrement renter's wallet
            yield prisma.wallet.update({
                where: { userId: rentalData.userId },
                data: { balance: { decrement: book.price } },
            });
            // Increment book owner's wallet
            yield prisma.ownerWallet.upsert({
                where: { ownerId: book.owner.id },
                update: { balance: { increment: book.price } },
                create: { ownerId: book.owner.id, balance: book.price },
            });
            // Create rental
            // Create rental
            const rental = yield prisma.rental.create({
                data: {
                    book: { connect: { id: rentalData.bookId } },
                    user: { connect: { id: rentalData.userId } },
                    startDate: new Date(rentalData.startDate),
                    endDate: new Date(rentalData.endDate),
                    status: rentalData.status,
                },
            });
            // Update book availability
            yield prisma.book.update({
                where: { id: rentalData.bookId },
                data: { availableQuantity: { decrement: 1 } },
            });
            return rental;
        })));
        res
            .status(201)
            .json({ message: 'Rental created successfully', rental: result });
    }
    catch (error) {
        console.error('Error creating rental:', error);
        res.status(500).json({ error: 'Error creating rental' });
    }
});
exports.createRental = createRental;
const getRental = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { rentalId } = req.params;
    try {
        const rental = yield prisma.rental.findUnique({
            where: { id: parseInt(rentalId) },
            include: { book: true, user: true },
        });
        if (!rental) {
            return res.status(404).json({ error: 'Rental not found' });
        }
        res.json(rental);
    }
    catch (error) {
        console.error('Error fetching rental:', error);
        res.status(500).json({ error: 'Error fetching rental' });
    }
});
exports.getRental = getRental;
const returnRental = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { rentalId } = req.params;
    try {
        const rental = yield prisma.rental.findUnique({
            where: { id: parseInt(rentalId) },
        });
        if (!rental) {
            return res.status(404).json({ error: 'Rental not found' });
        }
        const updatedRental = yield prisma.rental.update({
            where: { id: parseInt(rentalId) },
            data: { status: 'RETURNED' },
        });
        yield prisma.book.update({
            where: { id: rental.bookId },
            data: { availableQuantity: { increment: 1 } },
        });
        res.json({ message: 'Book returned successfully', rental: updatedRental });
    }
    catch (error) {
        console.error('Error returning rental:', error);
        res.status(500).json({ error: 'Error returning rental' });
    }
});
exports.returnRental = returnRental;
const getUserRentals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const rentals = yield prisma.rental.findMany({
            where: { userId },
            include: { book: true },
        });
        res.json(rentals);
    }
    catch (error) {
        console.error('Error fetching user rentals:', error);
        res.status(500).json({ error: 'Error fetching user rentals' });
    }
});
exports.getUserRentals = getUserRentals;
const isBookRentedByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, bookId } = req.params;
    try {
        const rental = yield prisma.rental.findFirst({
            where: {
                userId,
                bookId: parseInt(bookId),
                status: 'ACTIVE',
            },
        });
        res.json({ isRented: !!rental });
    }
    catch (error) {
        console.error('Error checking if book is rented:', error);
        res.status(500).json({ error: 'Error checking if book is rented' });
    }
});
exports.isBookRentedByUser = isBookRentedByUser;
const toggleRentalStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, bookId } = req.params;
    try {
        const result = yield prisma.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            const book = yield prisma.book.findUnique({
                where: { id: parseInt(bookId) },
            });
            if (!book) {
                throw new Error('Book not found');
            }
            const existingRental = yield prisma.rental.findFirst({
                where: {
                    userId,
                    bookId: parseInt(bookId),
                    status: 'ACTIVE',
                },
            });
            if (existingRental) {
                // Return the book
                yield prisma.rental.update({
                    where: { id: existingRental.id },
                    data: { status: 'RETURNED', endDate: new Date() },
                });
                yield prisma.book.update({
                    where: { id: parseInt(bookId) },
                    data: { availableQuantity: { increment: 1 } },
                });
                return { isRented: false, message: 'Book returned successfully' };
            }
            else {
                // Rent the book
                if (book.availableQuantity < 1) {
                    throw new Error('No copies of this book are currently available for rent');
                }
                yield prisma.rental.create({
                    data: {
                        userId,
                        bookId: parseInt(bookId),
                        startDate: new Date(),
                        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
                        status: 'ACTIVE',
                    },
                });
                yield prisma.book.update({
                    where: { id: parseInt(bookId) },
                    data: { availableQuantity: { decrement: 1 } },
                });
                return { isRented: true, message: 'Book rented successfully' };
            }
        }));
        res.json(result);
    }
    catch (error) {
        console.error('Error toggling rental status:', error);
        res.status(500).json({ error: 'Error toggling rental status' });
    }
});
exports.toggleRentalStatus = toggleRentalStatus;
