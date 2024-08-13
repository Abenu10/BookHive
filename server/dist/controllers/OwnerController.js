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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategories = exports.ownerLogout = exports.ownerWithdraw = exports.getOwnerBalance = exports.deleteBook = exports.getAllOwnerBooksById = exports.getAllOwnerBooks = exports.updateBook = exports.createBook = exports.loginOwner = exports.registerOwner = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const Cloudinary_1 = require("../services/Cloudinary");
const prisma = new client_1.PrismaClient();
const withdrawSchema = zod_1.z.object({
    amount: zod_1.z.number().positive(),
});
// Owner endpoints
const registerOwner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, location, phoneNumber, profileImage, wallet, } = req.body;
    phoneNumber;
    try {
        const existingOwner = yield prisma.owner.findFirst({
            where: {
                OR: [{ name }, { email }],
            },
        });
        if (existingOwner) {
            return res.status(400).json({ message: 'Name or email already exists' });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const owner = yield prisma.owner.create({
            data: {
                name,
                email,
                password: hashedPassword,
                location,
                phoneNumber,
                profileImage,
                wallet: {
                    create: { balance: 0 },
                },
            },
        });
        const payload = { id: owner.id, name: owner.name, email: owner.email };
        const accessToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '48h' });
        const refreshToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
});
exports.registerOwner = registerOwner;
const loginOwner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const owner = yield prisma.owner.findUnique({ where: { email } });
        if (!owner || !bcryptjs_1.default.compareSync(password, owner.password)) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // if (owner.status === 'INACTIVE') {
        //   return res
        //     .status(403)
        //     .json({message: 'Account not activated. Please contact admin.'});
        // }
        const payload = {
            id: owner.id,
            name: owner.name,
            email: owner.email,
        };
        const accessToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '48h' });
        const refreshToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
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
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Error logging in' });
    }
});
exports.loginOwner = loginOwner;
// TODO Book endpoints    TEST
const createBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, author, description, category, availableQuantity, price, quantity, } = req.body;
    const ownerId = req.ownerId;
    const coverImage = req.file;
    if (!coverImage) {
        return res.status(400).json({ error: 'Cover image is required' });
    }
    try {
        const owner = yield prisma.owner.findUnique({ where: { id: ownerId } });
        if (!owner) {
            return res.status(404).json({ error: 'Owner not found' });
        }
        if (owner.status === 'INACTIVE') {
            return res
                .status(403)
                .json({ message: 'Account not activated. Please contact admin.' });
        }
        const cloudinaryResult = yield (0, Cloudinary_1.uploadToCloudinary)(coverImage.path, 'book-covers');
        const book = yield prisma.book.create({
            data: {
                title,
                author,
                coverImage: cloudinaryResult.secure_url,
                description,
                category: { connect: { id: Number(category) } },
                availableQuantity: Number(availableQuantity),
                price: Number(price),
                quantity: Number(quantity),
                owner: { connect: { id: ownerId } },
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
    }
    catch (error) {
        console.error('Error creating book:', error);
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return res
                    .status(400)
                    .json({ error: 'A book with this title already exists' });
            }
            if (error.code === 'P2025') {
                return res.status(400).json({ error: 'Invalid category' });
            }
        }
        res.status(500).json({ error: 'Error creating book' });
    }
});
exports.createBook = createBook;
// TODO update book  TEST
const updateBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { bookId } = req.params;
    const { title, author, category, availableQuantity, price, quantity, reviewCount, rating, } = req.body;
    const ownerId = req.ownerId;
    const coverImage = req.file;
    if (!ownerId) {
        return res.status(400).json({ error: 'Owner ID is required' });
    }
    try {
        const owner = yield prisma.owner.findUnique({ where: { id: ownerId } });
        if (!owner) {
            return res.status(404).json({ error: 'Owner not found' });
        }
        if (owner.status === 'INACTIVE') {
            return res
                .status(403)
                .json({ message: 'Account not activated. Please contact admin.' });
        }
        const existingBook = yield prisma.book.findUnique({
            where: { id: Number(bookId) },
        });
        if (!existingBook) {
            return res.status(404).json({ error: 'Book not found' });
        }
        let coverImageUrl = existingBook.coverImage;
        if (coverImage) {
            const cloudinaryResult = yield (0, Cloudinary_1.uploadToCloudinary)(coverImage.path, 'book-covers');
            coverImageUrl = cloudinaryResult.secure_url;
            // Remove the old cover image from Cloudinary
            if (existingBook.coverImage) {
                const publicId = (_a = existingBook.coverImage
                    .split('/')
                    .pop()) === null || _a === void 0 ? void 0 : _a.split('.')[0];
                if (publicId) {
                    yield (0, Cloudinary_1.removeFromCloudinary)(publicId);
                }
            }
        }
        const updatedBook = yield prisma.book.update({
            where: { id: Number(bookId), ownerId: ownerId },
            data: {
                title: title || undefined,
                author: author || undefined,
                coverImage: coverImageUrl,
                category: category ? { connect: { id: Number(category) } } : undefined,
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
    }
    catch (error) {
        console.error('Error updating book:', error);
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                return res
                    .status(404)
                    .json({ error: 'Book not found or not owned by this owner' });
            }
        }
        res.status(500).json({ error: 'Error updating book' });
    }
});
exports.updateBook = updateBook;
const getAllOwnerBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ownerId = req.ownerId;
    if (!ownerId) {
        return res.status(400).json({ error: 'Owner ID is required' });
    }
    try {
        const owner = yield prisma.owner.findUnique({
            where: { id: ownerId },
            include: {
                books: {
                    include: {
                        category: true,
                    },
                },
            },
        });
        if (!owner) {
            return res.status(404).json({ error: 'Owner not found' });
        }
        const formattedBooks = owner.books.map((book) => {
            var _a;
            return (Object.assign(Object.assign({}, book), { categoryName: ((_a = book.category) === null || _a === void 0 ? void 0 : _a.name) || 'Uncategorized' }));
        });
        res.json(formattedBooks);
    }
    catch (error) {
        console.error('Error fetching owner books:', error);
        res.status(500).json({ error: 'Error fetching owner books' });
    }
});
exports.getAllOwnerBooks = getAllOwnerBooks;
const getAllOwnerBooksById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookId } = req.params;
    const ownerId = req.ownerId;
    if (!ownerId) {
        return res.status(400).json({ error: 'Owner ID is required' });
    }
    try {
        const owner = yield prisma.owner.findUnique({
            where: { id: ownerId },
            include: { books: true },
        });
        if (!owner) {
            return res.status(404).json({ error: 'Owner not found' });
        }
        const book = owner.books.find((b) => b.id === Number(bookId));
        if (!book) {
            return res
                .status(404)
                .json({ error: 'Book not found or not owned by this owner' });
        }
        res.json(book);
    }
    catch (error) {
        console.error('Error fetching owner book:', error);
        res.status(500).json({ error: 'Error fetching owner book' });
    }
});
exports.getAllOwnerBooksById = getAllOwnerBooksById;
// deleteBook
const deleteBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookId } = req.params;
    const ownerId = req.ownerId;
    if (!ownerId) {
        return res.status(400).json({ error: 'Owner ID is required' });
    }
    try {
        const owner = yield prisma.owner.findUnique({
            where: { id: ownerId },
            include: { books: true },
        });
        if (!owner) {
            return res.status(404).json({ error: 'Owner not found' });
        }
        const book = owner.books.find((b) => b.id === Number(bookId));
        if (!book) {
            return res
                .status(404)
                .json({ error: 'Book not found or not owned by this owner' });
        }
        yield prisma.book.delete({
            where: { id: Number(bookId) },
        });
        res.json({ message: 'Book deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({ error: 'Error deleting book' });
    }
});
exports.deleteBook = deleteBook;
const getOwnerBalance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ownerId } = req.params;
    const tokenOwnerId = req.ownerId;
    try {
        if (ownerId !== tokenOwnerId) {
            return res.status(403).json({
                error: 'Unauthorized: You can only get balance of your own wallet',
            });
        }
        const ownerWallet = yield prisma.ownerWallet.findUnique({ where: { ownerId } });
        if (!ownerWallet) {
            return res.status(404).json({ error: 'Wallet not found' });
        }
        res.json({ balance: ownerWallet.balance });
    }
    catch (error) {
        console.error('Error fetching owner wallet balance:', error);
        res.status(500).json({ error: 'Error fetching owner wallet balance' });
    }
});
exports.getOwnerBalance = getOwnerBalance;
const ownerWithdraw = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ownerId } = req.params;
    const tokenOwnerId = req.ownerId;
    const { amount } = withdrawSchema.parse(req.body);
    try {
        if (ownerId !== tokenOwnerId) {
            return res.status(403).json({
                error: 'Unauthorized: You can only withdraw from your own wallet',
            });
        }
        const ownerWallet = yield prisma.ownerWallet.findUnique({ where: { ownerId } });
        if (!ownerWallet || ownerWallet.balance < amount) {
            return res.status(400).json({ error: 'Insufficient funds' });
        }
        const updatedWallet = yield prisma.ownerWallet.update({
            where: { ownerId },
            data: { balance: { decrement: amount } },
        });
        res.json({
            message: 'Withdrawal successful',
            balance: updatedWallet.balance,
        });
    }
    catch (error) {
        console.error('Error withdrawing funds:', error);
        res.status(500).json({ error: 'Error withdrawing funds' });
    }
});
exports.ownerWithdraw = ownerWithdraw;
const ownerLogout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //TODO invalidate the token on the server-side
        res.status(200).json({ message: 'Logged out successfully' });
    }
    catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Error logging out' });
    }
});
exports.ownerLogout = ownerLogout;
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield prisma.category.findMany();
        res.json(categories);
    }
    catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Error fetching categories' });
    }
});
exports.getCategories = getCategories;
