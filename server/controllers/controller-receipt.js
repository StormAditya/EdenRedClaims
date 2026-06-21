const receipt = require('../models/receipt')
const {isAuth} = require('../utils/authentication')
const axios = require("axios");

const findReceiptInfo = async (req, res) => {
    try {
        const {claim_id} = req.body
        const foundreceipt = await receipt.findOne({ 
            where: { 
                claim_id: claim_id
            } 
        });
        if (!foundreceipt) {
            return res.status(404).json({ success: false, msg: "Receipt not found" });
        }
        let mongoImageData = null;
        try{
            const mongoResponse = await axios.get(`http://localhost:5001/api/documents/${foundreceipt.id}`);
            if (mongoResponse.data.success) {
                mongoImageData = mongoResponse.data.data.document_file;
            }
        }
        catch (mongoErr){
            console.log("No matching image found in MongoDB");
        }
        res.status(200).json({ success: true, data: { ...foundreceipt.toJSON(), document_file: mongoImageData } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: "Error fetching receipt" });
    }
}
const addReceiptInfo = async (req, res) => {
        try{
            const { claim_id,  receipt_amount, merchant_name, base64Image } = req.body
            const newClaim = await receipt.create({
                claim_id: claim_id,
                receipt_amount: receipt_amount,
                merchant_name: merchant_name
            })
            if (base64Image) {
                try {
                    await axios.post("http://localhost:5001/api/documents", {
                        receipt_id: String(newClaim.id),
                        document_file: base64Image
                    });
                }
                catch (mongoErr) {
                    console.error("Failed to forward image:", mongoErr.message);
                }
            }
            res.status(200).json({success:true, data: newClaim})
        }catch(err){
            console.error(err)
            res.status(500).json({success: false, msg: 'Server Error to Create Claim'})
        }
}
const deleteReceiptInfo = async (req, res) => {
    try {
        const { id } = req.body;
        const deletedRows = await receipt.destroy({
            where: { id: id }
        });
        try{
            await axios.delete(`http://localhost:5001/api/documents/${id}`);
        }
        catch (mongoErr){
            console.error("Failed to delete matching document from MongoDB")
        }
        res.status(200).json({ success: true, msg: "Receipt deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: "Error deleting receipt" });
    }
}
module.exports = {
    findReceiptInfo,
    addReceiptInfo,
    deleteReceiptInfo
}
