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
exports.getCategories = exports.getBooksFromCategory = exports.logout = exports.getBookDetailById = exports.getAvailableBooks = exports.deleteUser = exports.updateUser = exports.getUserById = exports.getAllUsers = exports.refreshToken = exports.login = exports.register = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, phoneNumber, profileImage, wallet, } = req.body;
    try {
        const existingUser = yield prisma.user.findFirst({
            where: {
                OR: [{ name }, { email }],
            },
        });
        if (existingUser) {
            return res.status(400).json({ message: 'Name or email already exists' });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = yield prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: client_1.Role.USER,
                phoneNumber,
                profileImage,
                wallet: {
                    create: { balance: 100 },
                },
            },
        });
        const payload = { id: user.id, name: user.name, email: user.email };
        const accessToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '48h' });
        const refreshToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
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
    }
    catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield prisma.user.findUnique({ where: { email } });
        if (!user ||
            !bcryptjs_1.default.compareSync(password, user.password) ||
            user.role === 'ADMIN') {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
        };
        const accessToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '48h' });
        const refreshToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
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
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Error logging in' });
    }
});
exports.login = login;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers['authorization'];
    const refreshToken = authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : null;
    if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token is required' });
    }
    try {
        const payload = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const accessToken = jsonwebtoken_1.default.sign({ id: payload.id, name: payload.name, email: payload.email }, process.env.JWT_ACCESS_SECRET, { expiresIn: '48h' });
        return res.json({
            access_token: `Bearer ${accessToken}`,
        });
    }
    catch (error) {
        return res.status(401).json({ message: 'Invalid refresh token' });
    }
});
exports.refreshToken = refreshToken;
const getAllUsers = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.user.findMany({
            where: {
                role: 'USER',
            },
            select: { id: true, name: true, email: true },
        });
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
});
exports.getAllUsers = getAllUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield prisma.user.findUnique({
            where: { id },
            select: { id: true, name: true, email: true },
        });
        if (user) {
            res.json(user);
        }
        else {
            res.status(404).json({ error: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching user' });
    }
});
exports.getUserById = getUserById;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.userId;
    const updateData = req.body;
    const requestingUserId = req.userId;
    const requestingUserRole = yield getUserRole(requestingUserId);
    try {
        if (requestingUserId !== id && requestingUserRole !== 'ADMIN') {
            return res.status(403).json({ error: 'Unauthorized to update this user' });
        }
        // Check if the user exists
        const existingUser = yield prisma.user.findUnique({
            where: { id },
        });
        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        const updatedUser = yield prisma.user.update({
            where: { id },
            data: updateData,
            select: { id: true, name: true, email: true, role: true },
        });
        res.json(updatedUser);
    }
    catch (error) {
        console.error('Error updating user:', error);
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                res.status(400).json({ error: 'Name or email already exists' });
            }
            else {
                res.status(500).json({ error: 'Error updating user' });
            }
        }
        else {
            res.status(500).json({ error: 'Error updating user' });
        }
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const requestingUserId = req.userId;
    const requestingUserRole = yield getUserRole(requestingUserId);
    try {
        if (requestingUserId !== id && requestingUserRole !== 'ADMIN') {
            return res.status(403).json({ error: 'Unauthorized to update this user' });
        }
        yield prisma.user.delete({ where: { id } });
        res.json({ message: 'User deleted successfully' });
    }
    catch (error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                res.status(404).json({ error: 'User not found' });
            }
            else {
                res.status(500).json({ error: 'Error 2 deleting user' });
            }
        }
        else {
            res.status(500).json({ error: 'Error  deleting user ' });
        }
    }
});
exports.deleteUser = deleteUser;
// Helper function to get user role
function getUserRole(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield prisma.user.findUnique({ where: { id: userId } });
        return (user === null || user === void 0 ? void 0 : user.role) || '';
    });
}
// Get available books
const getAvailableBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Fetching available books...');
        const availableBooks = yield prisma.book.findMany({
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
            return res.status(404).json({ message: 'No available books found' });
        }
        const formattedBooks = availableBooks.map((book) => {
            var _a, _b;
            return ({
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
                ownerName: ((_a = book.owner) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown',
                ownerLocation: ((_b = book.owner) === null || _b === void 0 ? void 0 : _b.location) || 'Unknown',
            });
        });
        res.json(formattedBooks);
    }
    catch (error) {
        console.error('Error fetching available books:', error);
        res
            .status(500)
            .json({ error: 'Error fetching available books', details: error });
    }
});
exports.getAvailableBooks = getAvailableBooks;
// get book detail
const getBookDetailById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookId } = req.params;
    try {
        const book = yield prisma.book.findFirst({
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
            return res.status(404).json({ message: 'Book not found' });
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
    }
    catch (error) {
        console.error('Error fetching book detail:', error);
        res.status(500).json({ error: 'Error fetching book detail' });
    }
});
exports.getBookDetailById = getBookDetailById;
// log Out
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //TODO:  invalidate the token on the server-side
        res.status(200).json({ message: 'Logged out successfully' });
    }
    catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Error logging out' });
    }
});
exports.logout = logout;
// get all books from category
const getBooksFromCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId } = req.params;
    if (!categoryId || isNaN(parseInt(categoryId))) {
        return res.status(400).json({ error: 'Invalid category ID' });
    }
    try {
        const books = yield prisma.book.findMany({
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
            return res.status(404).json({ message: 'No books found in this category' });
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
    }
    catch (error) {
        console.error('Error fetching books from category:', error);
        res.status(500).json({ error: 'Error fetching books from category' });
    }
});
exports.getBooksFromCategory = getBooksFromCategory;
// get all categories
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield prisma.category.findMany();
        res.json(categories);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching categories' });
    }
});
exports.getCategories = getCategories;
