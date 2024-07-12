import { Request, Response } from 'express';
import pool from '../config/database';


export class PhoneController {
    static async getAllPhones  ( req: Request, res: Response){

        try {
            // Get Phones from database Random form the databse  ORDER BY RAND()
            const [data] = await pool.execute(
               'SELECT * FROM phones ORDER BY RAND()  '  
            );
            res.status(200).json({'data': data})

           }catch (error) {
            res.status(500).json({ message: 'Internal server error' });
          }
    }
    static async getPhoneById  ( req: Request, res: Response){
        
        const {id} = req.body

        try {
            // Get Phones from database Random form the databse  ORDER BY RAND()
            const [data] = await pool.execute(
               'SELECT * FROM phones WHERE id = ?  ' ,[id]
            );
            res.status(200).json({'data': data})

           }catch (error) {
            res.status(500).json({ message: 'Internal server error' });
          }
    }

    static async deletePhone  ( req: Request, res: Response){
        const {id} =req.body;
        try {
            // Get Phones from database Random form the databse  ORDER BY RAND()
            const [data] = await pool.execute(
               'DELETE FROM phones WHERE id = ?  ' ,[id]
            );
            res.status(200).json({'data': data})

           }catch (error) {
            res.status(500).json({ message: 'Internal server error' });
          }
    }


    static async uploadPhone (req: Request, res: Response){
        const {
            vendorId,
            src,
            model,
            name,
            description,
            price,
            rating,
            category,
            brand,
            stockStatus,
            colorOptions,
            warranty,
            releaseDate,
            batteryLife,
            dimensions,
            operatingSystem,
            connectivity,
            discount,
            screenResolution,
            storageExpansion,
            
        } = req.body;

        try {
            const [result] = await pool.execute(
                'INSERT INTO phones (vendorId,src, model, name, description, price, rating, category, brand, stockStatus, colorOptions, warranty, releaseDate, batteryLife, dimensions, operatingSystem, connectivity, discount, screenResolution, storageExpansion) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                [
                    vendorId,
                    src,
                    model,
                    name,
                    description,
                    price,
                    rating,
                    category,
                    brand,
                    stockStatus,
                    colorOptions,
                    warranty,
                    releaseDate,
                    batteryLife,
                    dimensions,
                    operatingSystem,
                    connectivity,
                    discount,
                    screenResolution,
                    storageExpansion,
                ]
            );

            res.status(201).json({ message: 'Phone added successfully', phone: result });
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: 'Internal server error', error: error });
            } else {
                res.status(500).json({ message: 'Internal server error' });


             }   
            }

    }



    static async updatePhone(req: Request, res: Response) {
        
        const {
            id,
            vendorId,
            src,
            model,
            name,
            description,
            price,
            rating,
            category,
            brand,
            stockStatus,
            colorOptions,
            warranty,
            releaseDate,
            batteryLife,
            dimensions,
            operatingSystem,
            connectivity,
            discount,
            screenResolution,
            storageExpansion,
        } = req.body;

        try {
            const [result] = await pool.execute(
                'UPDATE phones SET vendorId =?, src = ?, model = ?, name = ?, description = ?, price = ?, rating = ?, category = ?, brand = ?, stockStatus = ?, colorOptions = ?, warranty = ?, releaseDate = ?, batteryLife = ?, dimensions = ?, operatingSystem = ?, connectivity = ?, discount = ?, screenResolution = ?, storageExpansion = ?  WHERE id = ?',
                [
                  
                    vendorId,
                    src,
                    model,
                    name,
                    description,
                    price,
                    rating,
                    category,
                    brand,
                    stockStatus,
                    colorOptions,
                    warranty,
                    releaseDate,
                    batteryLife,
                    dimensions,
                    operatingSystem,
                    connectivity,
                    discount,
                    screenResolution,
                    storageExpansion,
                    id
                ]
            );

            if ((result as any).affectedRows === 0) {
                return res.status(404).json({ message: 'Phone not found' });
            }
             

            res.status(200).json({ message: result });
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: 'Internal server error', error: error });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }



}