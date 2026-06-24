const receipt = require('../models/Receipt');

const addReceipt = async (req, res) => {
    try{
        const { imageBuffer, claim_id } = req.body;
        
        const newReceipt = await receipt.create({
            imageBuffer: imageBuffer,
            claim_id: claim_id
        });

        return res.status(200).json({success: true, data: newReceipt});
    }
    catch(err){
        console.error(err);
        return res.status(500).json({success: false, msg: "Server Error to add receipt..."});
    }
}

module.exports = {addReceipt}