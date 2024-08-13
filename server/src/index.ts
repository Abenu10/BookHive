import express, {Express, Request, Response} from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoutes from './routes/UserRoutes';
import rentalRoutes from './routes/RentalRoutes';
import ownerRoutes from './routes/OwnerRoute';
import adminRoutes from './routes/AdminRoutes';
import walletRoutes from './routes/WalletRoutes';
import authRoutes from './routes/AuthRoutes';

import ErrorHandler from './utils/ErrorHandler';

const app = express();
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
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
// app.use(errorConverter)
// app.use(errorHandler)

app.use('/api/users', userRoutes);
app.use('/api/owners', ownerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/wallets', walletRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({info: 'BookHive API'});
});

app.use(ErrorHandler);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
