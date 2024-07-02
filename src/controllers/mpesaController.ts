import { validationResult } from 'express-validator';
import { Request, Response } from 'express';
import axios from 'axios';
import { config } from 'dotenv';

config(); // Load environment variables from .env file

export class mpesaController {

    static async stkPush(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        const { phone, amount } = req.body;

        function generateTimestamp(): string {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const date = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            return `${year}${month}${date}${hours}${minutes}${seconds}`;
        }

        const Timestamp = generateTimestamp();
        const BusinessShortCode = process.env.MPESA_STORENUMBER;
        const passkey = process.env.MPESA_PASSKEY;
        const consumerKey = process.env.MPESA_CONSUMER_KEY;
        const consumerSecret = process.env.MPESA_CONSUMER_SECRET;

        // Ensure environment variables are defined
        if (!BusinessShortCode || !passkey || !consumerKey || !consumerSecret) {
            console.error('Missing environment variables');
            return res.status(400).json({ errors: 'Missing environment variables' });
        }

        // Create the password
        const password = Buffer.from(BusinessShortCode + passkey + Timestamp).toString("base64");
        console.log("Generated password:", password);

        // Function to generate OAuth2 token
        const generateToken = async (): Promise<string> => {
            const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
            try {
                const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
                    headers: {
                        Authorization: `Basic ${auth}`
                    }
                });
                console.log('Token response:', response.data.access_token);
                return response.data.access_token;
            } catch (error) {
                console.error('Error generating token:', error);
                throw new Error('Failed to generate token');
            }
        };
            
        try {
            const token = await generateToken();

            const mpesaRequest = {
                "BusinessShortCode": BusinessShortCode,
                "Password": password,
                "Timestamp": Timestamp,
                "TransactionType": "CustomerPayBillOnline",
                "Amount": amount,
                "PartyA": phone,
                "PartyB": BusinessShortCode,
                "PhoneNumber": phone,
                "CallBackURL": "https://f97d-41-90-179-220.ngrok-free.app",
                "AccountReference": phone,
                "TransactionDesc": "Payment for invoice INV12345"
            };

            const response = await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', mpesaRequest, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('STK Push response:', response.data);
            res.status(200).json({ message: 'STK Push initiated', data: response.data });

        } catch (error) {
            console.error('STK Push error:', error  );
            res.status(500).json({ message: 'STK Push failed', error: error  });
        }
    }
}
