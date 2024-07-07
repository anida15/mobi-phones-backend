import express from 'express';
import { CartController } from '../controllers/cartController';
 
const router = express.Router();
 


router.get('/', CartController.getCart);
router.post('/addToCart', CartController.addToCart);





export default router;