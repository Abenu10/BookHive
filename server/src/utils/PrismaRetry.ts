import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export const WithRetry = async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 'P2028'
      ) {
        retries++;
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
      } else {
        throw error;
      }
    }
  }
  throw new Error('Max retries reached');
};
