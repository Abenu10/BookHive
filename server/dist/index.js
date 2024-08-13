"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const UserRoutes_1 = __importDefault(require("./routes/UserRoutes"));
const RentalRoutes_1 = __importDefault(require("./routes/RentalRoutes"));
const OwnerRoute_1 = __importDefault(require("./routes/OwnerRoute"));
const AdminRoutes_1 = __importDefault(require("./routes/AdminRoutes"));
const WalletRoutes_1 = __importDefault(require("./routes/WalletRoutes"));
const AuthRoutes_1 = __importDefault(require("./routes/AuthRoutes"));
const ErrorHandler_1 = __importDefault(require("./utils/ErrorHandler"));
const app = (0, express_1.default)();
const port = process.env.PORT || 8001;
const corsOptions = {
    origin: [
        'http://localhost:5173',
        'https://book-hive-seven.vercel.app/',
        'https://book-hive-seven.vercel.app/',
        'https://book-hive-raiwrh47e-abenu10s-projects.vercel.app',
        'https://book-hive-seven.vercel.app'
    ],
    credentials: true,
    optionsSuccessStatus: 200,
};
app.use((0, cors_1.default)(corsOptions));
app.use(body_parser_1.default.json());
app.use(express_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// app.use(errorConverter)
// app.use(errorHandler)
app.use('/api/users', UserRoutes_1.default);
app.use('/api/owners', OwnerRoute_1.default);
app.use('/api/admin', AdminRoutes_1.default);
app.use('/api/rentals', RentalRoutes_1.default);
app.use('/api/wallets', WalletRoutes_1.default);
app.use('/api/auth', AuthRoutes_1.default);
app.get('/', (req, res) => {
    res.json({ info: 'BookHive API' });
});
app.use(ErrorHandler_1.default);
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
