import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

export class MpesaController {

    static async stkPush(req: Request, res: Response, next: NextFunction) {

        const url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";

        const consumer_key = "qtIXoBbuo8hHaj0TVQI2iHt5mAvmFMjiVgrzS0fsDm8KpTUx";
        const consumer_secret = "pBsz2uAmsjXiyAizL9oNAk71LA48LdUoaTXaBK627VPmEy5iZgVJoUlj7pDWOMcT";

        const auth = Buffer.from(`${consumer_key}:${consumer_secret}`).toString('base64');

        try {
            const response = await axios.get(url, {
                headers: {
                    "Authorization": `Basic ${auth}`
                }
            });
            const accessToken = response.data.access_token;
            console.log("Access Token:", accessToken);

            const endpoint = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
            const authHeader = `Bearer ${accessToken}`;
            console.log("Token", authHeader);

            const shortcode = "174379";
            const pass_key = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";

            // Correct the timestamp generation
            const datenow = new Date();
            const timestamp = datenow.getFullYear() +
                              ("0" + (datenow.getMonth() + 1)).slice(-2) + // Month is zero-indexed
                              ("0" + datenow.getDate()).slice(-2) +
                              ("0" + datenow.getHours()).slice(-2) +
                              ("0" + datenow.getMinutes()).slice(-2) +
                              ("0" + datenow.getSeconds()).slice(-2);

            // Generate the password
            const password = Buffer.from(`${shortcode}${pass_key}${timestamp}`).toString('base64');

            try {
                const stkResponse = await axios.post(endpoint, {
                    BusinessShortCode: shortcode,
                    Password: password,
                    Timestamp: timestamp,
                    TransactionType: "CustomerPayBillOnline",
                    Amount: "1",
                    PartyA: "254790359782",
                    PartyB: shortcode,
                    PhoneNumber: "254790359782",
                    CallBackURL: "https://mobi-phones-backend.onrender.com/api/mpesa/stk_callback",
                    AccountReference: "123Test",
                    TransactionDesc: "Processing"
                }, {
                    headers: {
                        "Authorization": authHeader,
                        "Content-Type": "application/json"
                    }
                });
                res.status(200).json(stkResponse.data);
            } catch (stkError) {
                if (axios.isAxiosError(stkError)) {
                    console.log(stkError.response ? stkError.response.data : stkError.message);
                    res.status(500).send(stkError.response ? stkError.response.data : stkError.message);
                } else {
                    console.log((stkError as Error).message);
                    res.status(500).send((stkError as Error).message);
                }
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log(error.response ? error.response.data : error.message);
                res.status(500).send(error.response ? error.response.data : error.message);
            } else {
                console.log((error as Error).message);
                res.status(500).send((error as Error).message);
            }
        }
    }

    static async callBack(req: Request, res: Response ){

        console.log("..........................STK.........................");
        console.log(req.body);
        res.status(200).send("STK Callback received");

    }

    
}
