const claims = require('../models/claims')
const createClaim = async (req, res) => {
    try{
        const { user_id, status_id, category_id, description, claim_amount ,submission_date} = req.body
        const newClaim = await claims.create({
            user_id: user_id,
            status_id: status_id,
            category_id: category_id,
            description: description,
            claim_amount: claim_amount,
            submission_date: submission_date
        })
        res.status(200).json({success:true, data: newClaim})
    }
    catch(err){
        console.error(err)
        res.status(500).json({success: false, msg: 'Server Error to Create Claim'})
    }
}

const getClaims = async (req,res) => {
    try{
        const claimsData = await claims.findAll()
        return res.status(200).json({success:true, data: claimsData})
    }catch(err){
        console.error(err)
        res.status(500).json({success:false, msg:"Error fetching claims"})
    }
    
}


module.exports = {
    createClaim,
    getClaims
}