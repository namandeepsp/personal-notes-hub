import express from 'express';
type Request = express.Request;
type Response = express.Response;
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use(testMiddleware);

app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', service: 'auth-service' });
});

function testMiddleware(req: Request, res: Response, next: Function) {
    console.log('Api called: ', req.method, req.body);
    next();
}

app.use('/', authRoutes);

export default app;
