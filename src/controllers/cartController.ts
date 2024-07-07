import { Request, Response } from 'express';
import pool from '../config/database';
import { ResultSetHeader } from 'mysql2';

export class CartController {


    static async getCart(req: Request, res: Response) {
        const {CustomerId}  = req.body  ;
        try {
        const [data] = await pool.execute(
            'SELECT * FROM cartItems WHERE CustomerId= ?  ',
             [CustomerId]
         );
         res.status(201).json({'data':data})
        }catch(error){
            if(error instanceof Error){
                res.status(500).json({ message: 'Internal server error', error: error });
            } else {
                res.status(500).json({ message: 'Internal server error' });
             }  
        }
    }

    static async addToCart(req: Request, res: Response) {
        const {CustomerName,CustomerId,PhoneName ,Quantity, Amount, status}  = req.body;
  
         const connection = await pool.getConnection();                
         try {
             // Start the transaction
            await connection.beginTransaction();
            //Insert in CartItmes
            const [resultID]  = await connection.execute<ResultSetHeader>(
            'INSERT INTO cartItems (PhoneName, CustomerId, Quantity,Amount) VALUES (?,?,?,?)',
                [PhoneName,CustomerId,Quantity,Amount]
            );
            //Insert in VendorPhoneOrder
            const [result2]  = await connection.execute(
                'INSERT INTO vendorPhoneOrder (CustomerName, CustomerID, PhoneName, CartId, Quantity, Amount, status) VALUES (?, ?, ?, ?, ?, ?, ? )',
                [CustomerName, CustomerId, PhoneName,  resultID.insertId, Quantity, Amount, status]
            );

            // Commit the transaction
            await connection.execute('COMMIT');
 
          res.status(201).json({ message: "Cart Added Successful!"});
            
        }catch (error) {
            // Rollback the transaction in case of an error
            await connection.rollback();
      
            // Handle the error and send an appropriate response
            if (error instanceof Error) {
              res.status(500).json({ message: 'Internal server error', error: error.message });
            } else {
              res.status(500).json({ message: 'Internal server error' });
            }
          } finally {
            // Release the connection back to the pool
            connection.release();
          }
        
    }


}