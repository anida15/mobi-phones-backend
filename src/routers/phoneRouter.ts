import express from 'express';
import { PhoneController } from '../controllers/phoneController';
import { authMiddleware } from '../middlewares/auth';

const router = express.Router();

// Define routes for phones
router.get('/', PhoneController.getAllPhones);
router.get('/:id', PhoneController.getPhoneById);
router.delete('/:id',authMiddleware, PhoneController.deletePhone); 
router.put('/:id',authMiddleware, PhoneController.updatePhone); 
router.post('/upload',authMiddleware, PhoneController.uploadPhone )

 
   
export default router;
