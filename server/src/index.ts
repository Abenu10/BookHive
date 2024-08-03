import express, {Express, Request, Response} from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoutes from './routes/UserRoutes';
import ErrorHandler from './utils/ErrorHandler';

const app = express();
const port = process.env.PORT || 8001;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
// app.use(errorConverter)
// app.use(errorHandler)

app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.json({info: 'BookHive API'});
});

app.use(ErrorHandler);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
