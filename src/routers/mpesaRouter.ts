import express from 'express';
import { body } from 'express-validator';
import { MpesaController } from '../controllers/mpesaController';
 

const router = express.Router();


// Define routes for mpesa
router.post('/stkPush',
  [
    body('amount')
      .isNumeric().withMessage('Amount must be a number'),
    body('phone')
      .isNumeric().withMessage('Phone number is not valid'),
  ],
  MpesaController.stkPush
);

router.post('/stk_callback', MpesaController.callBack);

export default router;
