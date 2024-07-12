import express from 'express';
import cors from 'cors';
import phoneRouter from './routers/phoneRouter';
import userRouter from './routers/userRouter';
import mpesaRouter from './routers/mpesaRouter';
import { authMiddleware } from './middlewares/auth'; 
import cartRouter from './routers/cartRouter';
const app = express();

const allowedOrigins = ['http://localhost:4000', 'https://mobi.phone.ottomansecurity.co.ke','https://sandbox.safaricom.co.ke','https://mobi-phones-backend.onrender.com'];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200  
};
  
app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/phones', phoneRouter);
app.use('/api/users', userRouter);
app.use('/api/mpesa', mpesaRouter);
app.use('/api/cart', authMiddleware, cartRouter );

export default app;
