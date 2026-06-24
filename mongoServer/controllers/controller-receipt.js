const Receipt = require('../models/Receipt');

// Controller function for POST /api/receipts
const createReceipt = async (req, res) => {
    try {
        const { imageBuffer, claim_id } = req.body;

        // Validation check
        if (!imageBuffer || !claim_id) {
            return res.status(400).json({ 
                success: false, 
                message: "Missing imageBuffer or claim_id payload." 
            });
        }

        // Create new document instance
        const newReceipt = new Receipt({
            imageBuffer, // Stores the Base64 string directly
            claim_id: Number(claim_id)
        });

        await newReceipt.save();

        return res.status(200).json({
            success: true,
            message: "Receipt attached to claim successfully!",
            receipt: newReceipt
        });

    } catch (error) {
        console.error("Receipt Save Error:", error);
        return res.status(500).json({ success: false, message: "Server error saving receipt." });
    }
};

module.exports = { createReceipt };