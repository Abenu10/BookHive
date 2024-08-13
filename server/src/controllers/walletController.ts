import {Request, Response} from 'express';
import {PrismaClient} from '@prisma/client';
import {z} from 'zod';

const prisma = new PrismaClient();

const depositSchema = z.object({
  amount: z.number().positive(),
});

export const deposit = async (req: Request, res: Response) => {
  const {userId} = req.params;
  const tokenUserId = (req as any).userId;

  const {amount} = depositSchema.parse(req.body);

  try {
    if (userId !== tokenUserId) {
      return res
        .status(403)
        .json({error: 'Unauthorized: You can only deposit to your own wallet'});
    }

    const updatedWallet = await prisma.wallet.upsert({
      where: {userId},
      update: {balance: {increment: amount}},
      create: {userId, balance: amount},
    });

    res.json({message: 'Deposit successful', balance: updatedWallet.balance});
  } catch (error) {
    console.error('Error depositing funds:', error);
    res.status(500).json({error: 'Error depositing funds'});
  }
};

const withdrawSchema = z.object({
  amount: z.number().positive(),
});

export const withdraw = async (req: Request, res: Response) => {
  const {userId} = req.params;
  const tokenUserId = (req as any).userId;

  const {amount} = withdrawSchema.parse(req.body);

  try {
    if (userId !== tokenUserId) {
      return res.status(403).json({
        error: 'Unauthorized: You can only withdraw from your own wallet',
      });
    }

    const wallet = await prisma.wallet.findUnique({where: {userId}});

    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({error: 'Insufficient funds'});
    }

    const updatedWallet = await prisma.wallet.update({
      where: {userId},
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
};

export const getBalance = async (req: Request, res: Response) => {
  const {userId} = req.params;
  const tokenUserId = (req as any).userId;

  try {
    if (userId !== tokenUserId) {
      return res.status(403).json({
        error: 'Unauthorized: You can only get balancer of your own wallet',
      });
    }
    const wallet = await prisma.wallet.findUnique({where: {userId}});

    if (!wallet) {
      return res.status(404).json({error: 'Wallet not found'});
    }

    res.json({balance: wallet.balance});
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    res.status(500).json({error: 'Error fetching wallet balance'});
  }
};
