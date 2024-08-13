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
exports.WithRetry = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const WithRetry = function withRetry(fn_1) {
    return __awaiter(this, arguments, void 0, function* (fn, maxRetries = 3) {
        let retries = 0;
        while (retries < maxRetries) {
            try {
                return yield fn();
            }
            catch (error) {
                if (typeof error === 'object' &&
                    error !== null &&
                    'code' in error &&
                    error.code === 'P2028') {
                    retries++;
                    yield new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
                }
                else {
                    throw error;
                }
            }
        }
        throw new Error('Max retries reached');
    });
};
exports.WithRetry = WithRetry;
