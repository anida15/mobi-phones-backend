import express from 'express';
import cors from 'cors';
import phoneRouter from './routers/phoneRouter';
import userRouter from './routers/userRouter';
import mpesaRouter from './routers/mpesaRouter';

const app = express();

const allowedOrigins = ['http://localhost:3000', 'https://mobi.phone.ottomansecurity.co.ke'];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/phones', phoneRouter);
app.use('/api/users', userRouter);
app.use('/api/mpesa', mpesaRouter);

export default app;
