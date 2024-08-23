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
exports.getFilteredOwners = exports.deleteAdmin = exports.updateAdmin = exports.deleteCategory = exports.createCategory = exports.deleteBook = exports.getFilteredBooks = exports.getAllBooks = exports.toggleBookStatus = exports.toggleOwnerStatus = exports.getAllOwners = exports.loginAdmin = exports.registerAdmin = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const caslAbility_1 = require("../config/caslAbility");
const prisma = new client_1.PrismaClient();
const registerAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, phoneNumber, profileImage, wallet, } = req.body;
    try {
        const existingUser = yield prisma.user.findFirst({
            where: {
                OR: [{ name }, { email }],
            },
        });
        if (existingUser) {
            return res.status(400).json({ message: "Name or email already exists" });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = yield prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: client_1.Role.ADMIN,
                phoneNumber,
                profileImage,
                wallet: {
                    create: { balance: 100 },
                },
            },
        });
        const payload = { id: user.id, name: user.name, email: user.email, role: user.role };
        const accessToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: "48h" });
        const refreshToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
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
        res.status(500).json({ message: "Something went wrong. Please try again." });
    }
});
exports.registerAdmin = registerAdmin;
const loginAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield prisma.user.findUnique({ where: { email } });
        if (!user ||
            !bcryptjs_1.default.compareSync(password, user.password) ||
            user.role !== client_1.Role.ADMIN) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        };
        const accessToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: "48h" });
        const refreshToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
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
        console.error("Login error:", error);
        res.status(500).json({ error: "Error logging in" });
    }
});
exports.loginAdmin = loginAdmin;
// Get all owners
const getAllOwners = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ability = (0, caslAbility_1.buildAbility)(req.user.role);
    if (ability.can('read', 'Owners')) {
        try {
            const owners = yield prisma.owner.findMany();
            res.json(owners);
        }
        catch (error) {
            console.error("Error fetching owners:", error);
            res.status(500).json({ error: "Error fetching owners" });
        }
    }
    else {
        res.status(403).json({ error: "Unauthorized to view owners" });
    }
});
exports.getAllOwners = getAllOwners;
const toggleOwnerStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ability = (0, caslAbility_1.buildAbility)(req.user.role);
    if (ability.can('update', 'toggleOwner')) {
        const { ownerId } = req.params;
        try {
            const owner = yield prisma.owner.findUnique({
                where: { id: ownerId },
            });
            if (!owner) {
                return res.status(404).json({ error: "Owner not found" });
            }
            const newStatus = owner.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
            const updatedOwner = yield prisma.owner.update({
                where: { id: ownerId },
                data: { status: newStatus },
            });
            res.json({
                message: `Owner account ${newStatus.toLowerCase()}`,
                ownerId: updatedOwner.id,
                status: updatedOwner.status,
            });
        }
        catch (error) {
            console.error("Error toggling owner status:", error);
            res.status(500).json({ error: "Error updating owner account status" });
        }
    }
    else {
        res.status(403).json({ error: "Unauthorized to toggle owner status" });
    }
});
exports.toggleOwnerStatus = toggleOwnerStatus;
const toggleBookStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ability = (0, caslAbility_1.buildAbility)(req.user.role);
    if (ability.can('update', 'toggleBook')) {
        const { bookId } = req.params;
        try {
            const book = yield prisma.book.findUnique({
                where: { id: parseInt(bookId) },
            });
            if (!book) {
                return res.status(404).json({ error: "Book not found" });
            }
            const newStatus = book.status === "APPROVED" ? "PENDING" : "APPROVED";
            const updatedBook = yield prisma.book.update({
                where: { id: parseInt(bookId) },
                data: { status: newStatus },
            });
            res.json({
                message: `Book status changed to ${newStatus.toLowerCase()}`,
                bookId: updatedBook.id,
                status: updatedBook.status,
            });
        }
        catch (error) {
            console.error("Error toggling book status:", error);
            res.status(500).json({ error: "Error updating book status" });
        }
    }
    else {
        res.status(403).json({ error: "Unauthorized to toggle book status" });
    }
});
exports.toggleBookStatus = toggleBookStatus;
// Get all books for admin dashboard
const getAllBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const books = yield prisma.book.findMany({
            include: { owner: true, category: true },
        });
        const formattedBooks = books.map((book) => {
            var _a;
            return (Object.assign(Object.assign({}, book), { categoryName: ((_a = book.category) === null || _a === void 0 ? void 0 : _a.name) || "Uncategoriezed" }));
        });
        res.json(formattedBooks);
    }
    catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ error: "Error fetching books" });
    }
});
exports.getAllBooks = getAllBooks;
const getFilteredBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { search, id, title, author, category, owner, ownerLocation, status } = req.query;
    try {
        let query = {};
        if (search) {
            query.OR = [
                { title: { contains: search, mode: "insensitive" } },
                { author: { contains: search, mode: "insensitive" } },
                { owner: { name: { contains: search, mode: "insensitive" } } },
                { category: { name: { contains: search, mode: "insensitive" } } },
            ];
        }
        if (id)
            query.id = { equals: parseInt(id) };
        if (title)
            query.title = { contains: title, mode: "insensitive" };
        if (author)
            query.author = { contains: author, mode: "insensitive" };
        if (category)
            query.category = { name: { contains: category, mode: "insensitive" } };
        if (owner)
            query.owner = { name: { contains: owner, mode: "insensitive" } };
        if (ownerLocation)
            query.owner = { location: { contains: ownerLocation, mode: "insensitive" } };
        if (status)
            query.status = status;
        const books = yield prisma.book.findMany({
            where: query,
            include: { owner: true, category: true },
            orderBy: { title: "asc" },
        });
        const formattedBooks = books.map((book) => {
            var _a;
            return (Object.assign(Object.assign({}, book), { categoryName: ((_a = book.category) === null || _a === void 0 ? void 0 : _a.name) || "Uncategorized", ownerLocation: book.owner.location }));
        });
        res.json(formattedBooks);
    }
    catch (error) {
        console.error("Error fetching filtered books:", error);
        res.status(500).json({ error: "Error fetching filtered books" });
    }
});
exports.getFilteredBooks = getFilteredBooks;
// deletee book
const deleteBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookId } = req.params;
    const userId = req.userId;
    if (!userId) {
        return res.status(400).json({ error: "Owner ID is required" });
    }
    try {
        const book = yield prisma.book.findUnique({
            where: { id: parseInt(bookId) },
            include: { owner: true },
        });
        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }
        yield prisma.book.delete({
            where: { id: parseInt(bookId) },
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
    }
    catch (error) {
        console.error("Error deleting book:", error);
        res.status(500).json({ error: "Error deleting book" });
    }
});
exports.deleteBook = deleteBook;
// create category
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ability = (0, caslAbility_1.buildAbility)(req.user.role);
    if (ability.can('create', 'Category')) {
        const categoryData = req.body;
        try {
            const existingCategory = yield prisma.category.findUnique({
                where: { name: categoryData.name },
            });
            if (existingCategory) {
                return res.status(400).json({
                    message: "A category with this name already exists",
                    categoryId: existingCategory.id,
                });
            }
            const category = yield prisma.category.create({
                data: categoryData,
            });
            res.status(201).json({
                message: "Category created successfully",
                categoryId: category.id,
            });
        }
        catch (error) {
            console.error("Error creating category:", error);
            res.status(500).json({ error: "Error creating category" });
        }
    }
    else {
        res.status(403).json({ error: "Unauthorized to create category" });
    }
});
exports.createCategory = createCategory;
// delete category
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ability = (0, caslAbility_1.buildAbility)(req.user.role);
    if (ability.can('delete', 'Category')) {
        const { id } = req.params;
        try {
            // Check if there are any books associated with this category
            const booksInCategory = yield prisma.book.count({
                where: { categoryId: parseInt(id) },
            });
            if (booksInCategory > 0) {
                return res.status(400).json({
                    error: "Cannot delete category. There are books associated with this category.",
                });
            }
            yield prisma.category.delete({
                where: { id: parseInt(id) },
            });
            res.json({ message: "Category deleted successfully" });
        }
        catch (error) {
            console.error("Error deleting category:", error);
            res.status(500).json({ error: "Error deleting category" });
        }
    }
    else {
        res.status(403).json({ error: "Unauthorized to delete category" });
    }
});
exports.deleteCategory = deleteCategory;
// update Admn
const updateAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.userId;
    const updateData = req.body;
    try {
        const existingUser = yield prisma.user.findUnique({ where: { id } });
        if (!existingUser || existingUser.role !== client_1.Role.ADMIN) {
            return res.status(403).json({ message: "Forbidden" });
        }
        if (!existingUser) {
            return res.status(404).json({ error: "User not found" });
        }
        const updatedUser = yield prisma.user.update({
            where: { id },
            data: updateData,
            select: { id: true, name: true, email: true, role: true },
        });
        res.json(updatedUser);
    }
    catch (error) {
        console.error("Error updating admin:", error);
        res.status(500).json({ error: "Error updating admin" });
    }
});
exports.updateAdmin = updateAdmin;
// delete admin
const deleteAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.wallet.delete({ where: { userId: id } });
        yield prisma.user.delete({ where: { id } });
        res.json({ message: "Admin deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting admin:", error);
        res.status(500).json({ error: "Error deleting admin" });
    }
});
exports.deleteAdmin = deleteAdmin;
// get flterd owners
const getFilteredOwners = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { search, id, email, name, phoneNumber, location, status } = req.query;
    try {
        let query = {};
        if (search) {
            query.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
            ];
        }
        if (id)
            query.id = { equals: id };
        if (email)
            query.email = { contains: email, mode: "insensitive" };
        if (name)
            query.name = { contains: name, mode: "insensitive" };
        if (phoneNumber)
            query.phoneNumber = { contains: phoneNumber, mode: "insensitive" };
        if (location)
            query.location = { contains: location, mode: "insensitive" };
        if (status)
            query.status = status;
        const owners = yield prisma.owner.findMany({
            where: query,
            orderBy: { name: "asc" },
        });
        res.json(owners);
    }
    catch (error) {
        console.error("Error fetching filtered owners:", error);
        res.status(500).json({ error: "Error fetching filtered owners" });
    }
});
exports.getFilteredOwners = getFilteredOwners;
