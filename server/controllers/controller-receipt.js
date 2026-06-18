const receipt = require('../models/receipt')
const {isAuth} = require('../utils/authentication')

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
        res.status(200).json({ success: true, data: foundreceipt });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: "Error fetching receipt" });
    }
}
const addReceiptInfo = async (req, res) => {
        try{
            const { claim_id,  receipt_amount, merchant_name } = req.body
            const newClaim = await receipt.create({
                claim_id: claim_id,
                receipt_amount: receipt_amount,
                merchant_name: merchant_name
            })
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
