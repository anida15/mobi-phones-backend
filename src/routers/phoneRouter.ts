import express from 'express';
import { PhoneController } from '../controllers/phoneController';
import { authMiddleware } from '../middlewares/auth';

const router = express.Router();

// Define routes for phones
router.get('/', PhoneController.getAllPhones);
router.get('/getPhone', PhoneController.getPhoneById);
router.delete('/delete',authMiddleware, PhoneController.deletePhone); 
router.post('/updatePhone',authMiddleware, PhoneController.updatePhone); 
router.post('/upload',authMiddleware, PhoneController.uploadPhone )

 
   
export default router;
