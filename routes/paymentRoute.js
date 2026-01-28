const express = require('express');
const router = express.Router();
const { verifyPayment } = require('../services/paystackService');
const Session = require('../models/Sessions');

router.get('/callback', async (req, res) => {
    const { reference, deviceId } = req.query;

    if (!reference || !deviceId) {
        return res.status(400).send('Missing payment reference or device ID');
    }

    try {
        const paymentData = await verifyPayment(reference);

        if (paymentData.status === 'success') {
            const session = await Session.findOne({ deviceId });
            
            if (session) {
                // Find the pending order with the matching reference
                const orderIndex = session.orderHistory.findIndex(o => o.reference === reference);
                
                if (orderIndex !== -1) {
                    session.orderHistory[orderIndex].status = "Paid";
                } else {
                     // Fallback if not found (shouldn't happen if flow is correct)
                     // But if we cleared currentOrder and didn't save it to history? 
                     // No, we saved it to history in chatLogic (Case 99).
                     console.warn("Order not found in history for reference:", reference);
                     // Optionally push it here if missing?
                     // session.orderHistory.push({ items: session.currentOrder, status: 'Paid', ... });
                     // But chatLogic cleared currentOrder. So we rely on it being in history.
                }

                // session.orderHistory.push(session.currentOrder); // Removed as we added it in chatLogic
                // session.currentOrder = []; // Already cleared in chatLogic
                
                session.state = "IDLE";
                session.paymentReference = null; 
                session.markModified('orderHistory'); // Important for mixed array updates
                await session.save();
                
                return res.redirect(`http://localhost:8000/?payment=success`); 
            }
        }
        
        res.redirect(`http://localhost:8000/?payment=failed`);
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).send('Payment verification failed');
    }
});

module.exports = router;
