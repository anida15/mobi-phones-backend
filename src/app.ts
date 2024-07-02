import express from 'express';
import cors from 'cors';
import phoneRouter from './routers/phoneRouter';
import userRouter from './routers/userRouter';
import mpesaRouter from './routers/mpesaRouter';


const app = express();

// Configure CORS options
const corsOptions: cors.CorsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

// Use CORS middleware with the specified options
app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/phones', phoneRouter);
app.use('/api/users', userRouter);
app.use('/api/mpesa', mpesaRouter ); ;

export default app;
