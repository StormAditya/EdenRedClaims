const Receipt = require('../models/Receipt');

const createReceipt = async (req, res) => {
    try {
        const { imageBuffer, claim_id } = req.body;

        if (!imageBuffer || !claim_id) {
            return res.status(400).json({ 
                success: false, 
                message: "Missing imageBuffer or claim_id payload." 
            });
        }

        const newReceipt = new Receipt({
            imageBuffer, 
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
        return res.status(500).json({ success: false, message: "Server error saving receipt..." });
    }
};

const getReceipt = async (req, res) => {
    try{    
        const {id} = req.params;

        const response = await Receipt.findOne({ claim_id: Number(id)});

        if(!response){
            return res.status(404).json({success: false, msg: 'Receipt not found'});
        }

        return res.status(200).json({success: true, data: response});
    }
    catch(err){
        console.error(err);
        res.status(500).json({success: false, message: "Server Error to fetch..."})
    }
}
const getAllReceipts = async (req, res) => {
    try {    
        const receipts = await Receipt.find({});

        if (receipts.length === 0) {
            return res.status(404).json({ success: false, msg: 'No receipts found' });
        }

        return res.status(200).json({ success: true, data: receipts });
    }
    catch (err) {
        console.error(err);

        return res.status(500).json({ success: false, msg: "Server Error to fetch..." });
    }
}

const deleteReceipt = async (req, res) => {
    try{
        const {claim_id} = req.body;
        const response = await Receipt.findOneAndDelete(
            { claim_id: Number(claim_id)}, 
        );

        if(!response){
            return res.status(404).json({success: false, msg: 'Receipt not found'});
        }

        return res.status(200).json({success: true, data: response});

    }
    catch(err){
        console.error(err);
        res.status(500).json({success: false, msg: 'Server Error to delete receipt...'})
    }
}

const updateReceipt = async (req, res) => {
    try{
        const {claim_id, imageBuffer} = req.body;

        const response = await Receipt.findOneAndUpdate(
            { claim_id: Number(claim_id)}, 
            { $set: {imageBuffer}},
            { new: true }
        );

        if(!response){
            return res.status(404).json({success: false, msg: 'Receipt not found'});
        }

        return res.status(200).json({success: true, data: response});

    }
    catch(err){
        console.error(err);
        res.status(500).json({success: false, msg: 'Server Error to update receipt...'})
    }
}

module.exports = { createReceipt, getReceipt, updateReceipt, deleteReceipt, getAllReceipts };