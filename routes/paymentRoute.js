const express = require('express');
const router = express.Router();
const { verifyPayment } = require('../services/paystackService');


router.get('/callback', async (req, res) => {
    const { reference } = req.query;

    if (!reference) {
        return res.status(400).send('Missing payment reference');
    }

    try {
        const paymentData = await verifyPayment(reference);

        if (paymentData.status === 'success') {
            // Use req.session directly
            const session = req.session;
            
            if (session && session.orderHistory) {
                // Find the pending order with the matching reference
                const orderIndex = session.orderHistory.findIndex(o => o.reference === reference);
                
                if (orderIndex !== -1) {
                    session.orderHistory[orderIndex].status = "Paid";
                } else {
                     console.warn("Order not found in history for reference:", reference);
                }

                session.state = "IDLE";
                session.paymentReference = null; 
                
                // Explicitly save the session
                await new Promise((resolve, reject) => {
                    session.save((err) => {
                        if (err) return reject(err);
                        resolve();
                    });
                });
                
                // Redirect relative to the domain handling the request
                return res.redirect(`/?payment=success`); 
            }
        }
        
        res.redirect(`/?payment=failed`);
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).send('Payment verification failed');
    }
});

module.exports = router;
