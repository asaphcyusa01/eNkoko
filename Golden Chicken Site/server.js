const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(express.json());

// Replace these with your MTN MoMo credentials
const MOMO_API_KEY = 'your_momo_api_key';
const MOMO_API_USER = 'your_momo_api_user';
const MOMO_API_BASE_URL = 'https://sandbox.momodeveloper.mtn.com';
const MOMO_COLLECTION_PRIMARY_KEY = 'b84053fb6bd34bf0bbc5b88af42fe902';

// Step 1: Obtain an access token for authentication
app.post('/momo-auth', async (req, res) => {
    try {
        const response = await axios.post(
            `${MOMO_API_BASE_URL}/collection/token/`,
            {},
            {
                headers: {
                    'Ocp-Apim-Subscription-Key': MOMO_COLLECTION_PRIMARY_KEY,
                    'Authorization': `Basic ${Buffer.from(`${MOMO_API_USER}:${MOMO_API_KEY}`).toString('base64')}`
                }
            }
        );
        res.status(200).json({ accessToken: response.data.access_token });
    } catch (error) {
        res.status(500).json({ error: 'Error obtaining access token', details: error.message });
    }
});

// Step 2: Create a payment request using the widget
app.post('/momo-payment', async (req, res) => {
    const { amount, currency, externalId, payer, payerMessage, payeeNote } = req.body;

    try {
        const authResponse = await axios.post(
            `${MOMO_API_BASE_URL}/collection/token/`,
            {},
            {
                headers: {
                    'Ocp-Apim-Subscription-Key': MOMO_COLLECTION_PRIMARY_KEY,
                    'Authorization': `Basic ${Buffer.from(`${MOMO_API_USER}:${MOMO_API_KEY}`).toString('base64')}`
                }
            }
        );
        const accessToken = authResponse.data.access_token;

        const paymentRequestResponse = await axios.post(
            `${MOMO_API_BASE_URL}/collection/v1_0/requesttopay`,
            {
                amount,
                currency,
                externalId,
                payer: {
                    partyIdType: 'MSISDN',
                    partyId: payer
                },
                payerMessage,
                payeeNote
            },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'X-Reference-Id': externalId,
                    'X-Target-Environment': 'sandbox',
                    'Content-Type': 'application/json',
                    'Ocp-Apim-Subscription-Key': MOMO_COLLECTION_PRIMARY_KEY
                }
            }
        );

        res.status(200).json({ paymentStatus: 'Payment request created successfully', details: paymentRequestResponse.data });
    } catch (error) {
        res.status(500).json({ error: 'Error creating payment request', details: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
