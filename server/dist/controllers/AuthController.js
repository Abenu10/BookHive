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
exports.getCurrentUser = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const userType = req.userType;
    try {
        let user;
        let roles;
        switch (userType) {
            case 'USER':
                user = yield prisma.user.findUnique({
                    where: { id: userId },
                    select: { id: true, name: true, email: true, role: true },
                });
                roles = user ? [user.role] : [];
                break;
            case 'ADMIN':
                user = yield prisma.user.findUnique({
                    where: { id: userId, role: 'ADMIN' },
                    select: { id: true, name: true, email: true, role: true },
                });
                roles = user ? [user.role] : [];
                break;
            case 'OWNER':
                user = yield prisma.owner.findUnique({
                    where: { id: userId },
                    select: { id: true, name: true, email: true },
                });
                roles = ['OWNER'];
                break;
            default:
                return res.status(400).json({ message: 'Invalid user type' });
        }
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ user, roles });
    }
    catch (error) {
        console.error('Error fetching current user:', error);
        res.status(500).json({ message: 'Error fetching user data' });
    }
});
exports.getCurrentUser = getCurrentUser;
