import express from 'express';
import { CartController } from '../controllers/cartController';
 
const router = express.Router();
 


router.get('/', CartController.getCart);
router.post('/addToCart', CartController.addToCart);
router.delete('/deleteToCart', CartController.deleteToCart);
router.post('/updateToCart',CartController.updateToCart)
router.post('/completOrder',CartController.completOrder);


    


export default router;