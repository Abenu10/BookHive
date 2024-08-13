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
exports.getBalance = exports.withdraw = exports.deposit = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
const depositSchema = zod_1.z.object({
    amount: zod_1.z.number().positive(),
});
const deposit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const tokenUserId = req.userId;
    const { amount } = depositSchema.parse(req.body);
    try {
        if (userId !== tokenUserId) {
            return res
                .status(403)
                .json({ error: 'Unauthorized: You can only deposit to your own wallet' });
        }
        const updatedWallet = yield prisma.wallet.upsert({
            where: { userId },
            update: { balance: { increment: amount } },
            create: { userId, balance: amount },
        });
        res.json({ message: 'Deposit successful', balance: updatedWallet.balance });
    }
    catch (error) {
        console.error('Error depositing funds:', error);
        res.status(500).json({ error: 'Error depositing funds' });
    }
});
exports.deposit = deposit;
const withdrawSchema = zod_1.z.object({
    amount: zod_1.z.number().positive(),
});
const withdraw = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const tokenUserId = req.userId;
    const { amount } = withdrawSchema.parse(req.body);
    try {
        if (userId !== tokenUserId) {
            return res.status(403).json({
                error: 'Unauthorized: You can only withdraw from your own wallet',
            });
        }
        const wallet = yield prisma.wallet.findUnique({ where: { userId } });
        if (!wallet || wallet.balance < amount) {
            return res.status(400).json({ error: 'Insufficient funds' });
        }
        const updatedWallet = yield prisma.wallet.update({
            where: { userId },
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
exports.withdraw = withdraw;
const getBalance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const tokenUserId = req.userId;
    try {
        if (userId !== tokenUserId) {
            return res.status(403).json({
                error: 'Unauthorized: You can only get balancer of your own wallet',
            });
        }
        const wallet = yield prisma.wallet.findUnique({ where: { userId } });
        if (!wallet) {
            return res.status(404).json({ error: 'Wallet not found' });
        }
        res.json({ balance: wallet.balance });
    }
    catch (error) {
        console.error('Error fetching wallet balance:', error);
        res.status(500).json({ error: 'Error fetching wallet balance' });
    }
});
exports.getBalance = getBalance;
