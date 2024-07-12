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
        const {vendorId,CustomerName,CustomerId,PhoneName ,Quantity, Amount, status}  = req.body;
  
         const connection = await pool.getConnection();                
         try {
             // Start the transaction
            await connection.beginTransaction();
            //Insert in CartItmes
            const [resultID]  = await connection.execute<ResultSetHeader>(
            'INSERT INTO cartItems (vendorId, PhoneName, CustomerId, Quantity,Amount) VALUES (?,?,?,?,?)',
                [vendorId, PhoneName,CustomerId,Quantity,Amount]
            );
            //Insert in VendorPhoneOrder
            const [result2]  = await connection.execute(
                'INSERT INTO vendorPhoneOrder (vendorId, CustomerName, CustomerID, PhoneName, CartId, Quantity, Amount, status) VALUES (?, ?, ?, ?, ?, ?, ? ,?)',
                [vendorId,CustomerName, CustomerId, PhoneName,  resultID.insertId, Quantity, Amount, status]
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

    
    static async deleteToCart (req: Request,res: Response){
        const {CartId} = req.body;

        try {
        const [data] = await pool.execute(
            'DELETE FROM cartItems WHERE CartId=?',
            [
                CartId
            ]
        );
        res.status(201).json({message: data})

        }catch (error) {
      
            // Handle the error and send an appropriate response
            if (error instanceof Error) {
              res.status(500).json({ message: 'Internal server error', error: error.message });
            } else {
              res.status(500).json({ message: 'Internal server error' });
            }
        
        }
    }

    static async updateToCart (req: Request,res: Response){
        const {vendorId,CartId,CustomerName,CustomerId,PhoneName ,Quantity, Amount, status}  = req.body;
  
        const connection = await pool.getConnection();                
        try {
            // Start the transaction
           await connection.beginTransaction();
           //Update in CartItmes
           const [resultID]  = await connection.execute<ResultSetHeader>(
           'UPDATE cartItems SET vendorId =?, PhoneName = ?, CustomerId = ?, Quantity = ?,Amount =? WHERE  CartId = ? ',
               [vendorId,PhoneName,CustomerId,Quantity,Amount,CartId]
           );
           //Update in VendorPhoneOrder
           const [result2]  = await connection.execute(
               'UPDATE vendorPhoneOrder SET vendorId=?, CustomerName =?, CustomerID =?, PhoneName =?, Quantity =?, Amount =?, status =? WHERE CartId =?',
               [vendorId, CustomerName, CustomerId, PhoneName,Quantity, Amount, status,CartId]
           );

           // Commit the transaction
           await connection.execute('COMMIT');

         res.status(201).json({ message: "Cart Updated Successful!"});
           
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

    static async completOrder(req: Request, res: Response){
 
      const {vendorId,CartId,CustomerName,CustomerId,PhoneName ,Quantity, Amount,customerStatus, vendorStatus}  = req.body;

      const connection = await pool.getConnection();
      try{
          await connection.beginTransaction();
          const [resultID]  = await connection.execute<ResultSetHeader>(
            'DELETE FROM cartItems WHERE CartId=?',
            [
                CartId
            ]
        ); 
        //Insert in VendorPhoneOrder
        const [result2]  = await connection.execute(
            'INSERT INTO transactions (vendorId, CustomerName, CustomerID, PhoneName, CartId, Quantity, Amount,customerStatus, vendorStatus) VALUES (?, ?, ?, ?, ?, ?, ? ,?,?)',
            [vendorId,CustomerName, CustomerId, PhoneName,  CartId, Quantity, Amount, customerStatus,vendorStatus]
        );

        // Commit the transaction
        await connection.execute('COMMIT');

      res.status(201).json({ message: "Order Completed Successful!"});



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