const claims = require('../models/claims')
const {isAuth} = require('../utils/authentication')
const createClaim = async (req, res) => {
    try{
        const { status_id, category_id, description, claim_amount} = req.body
        const newClaim = await claims.create({
            user_id: req.user.userId,
            status_id: 1,
            category_id: category_id,
            description: description,
            claim_amount: claim_amount,
            company_id: req.user.company_id,
        })
        
        res.status(200).json({success:true, data: newClaim})
    }
    catch(err){
        console.error(err)
        res.status(500).json({success: false, msg: 'Server Error to Create Claim'})
    }
}

const getAllClaims = async (req,res) => {
    try{
        const claimsData = await claims.findAll({
            where: {
            }
        })
        return res.status(200).json({success:true, data: claimsData})
    }catch(err){
        console.error(err)
        res.status(500).json({success:false, msg:"Error fetching claims"})
    }
    
}

const getClaims = async (req, res) => {
    try{
        const userId = req.user.userId

        if (!userId) {
            return res.status(401).json({ success: false, msg: 'Unauthorized: missing user id in token' })
        }

        const claimsData = await claims.findAll({
            where: {
                user_id: userId,
            }
        }) 
        return res.status(200).json({success:true, data: claimsData})
    }catch(err){
        console.error(err)
        res.status(500).json({success:false, msg:"Error fetching claims"})
    }
}

const getOneClaim = async (req, res) => {
    try{
        const { claimId } = req.params;
        console.log("claimId:", claimId);
        if (!claimId) {
            return res.status(400).json({ success: false, msg: 'ClaimID not found' });
        }

        const claimsData = await claims.findOne({
            where: {
                id: claimId
            }
        }) 

        if (!claimsData) {
            return res.status(404).json({success: false, msg: 'Claim not found'});
        }
        return res.status(200).json({success:true, data: claimsData})   
    }
    catch(err){
        console.error(err)
        res.status(500).json({success:false, msg:"Error fetching claims"})  
    }
}


const updateClaimEmployee = async (req, res) => {
    try{
        const { claim_id, category_id, description, claim_amount } = req.body
        
        const [updatedRows] = await claims.update(
            {
                category_id: category_id,
                description: description,
                claim_amount: claim_amount,
            },
            {
                where: {
                    id: claim_id
                }
            }
        )

        if( updatedRows === 0) return res.status(404).json({success: false, msg: 'Claim_ID not found'})
        
        return res.status(200).json({success: true, data: updatedRows})
    }
    catch(err){
        console.error(err)
        res.status(500).json({success: false, msg: "Error updating claims"})
    }
}

const updateClaimAdmin = async (req, res) => {
    try{
        
        const { claim_id, status_id } = req.body
        const claimToUpdate = await claims.findOne({
            where: {
                id: claim_id
            }
        })
        var approvedAmount = null;
        if(!claimToUpdate){
            return res.status(404).json({success: false, msg: 'Claim_ID not found'})
        }
        if(status_id === 2){
            approvedAmount = claimToUpdate.claim_amount;
        }
        if(status_id === 3){
            approvedAmount = 0;
        }

        const [updatedRows] = await claims.update(
            {
                status_id: status_id,
                approved_amount: approvedAmount
            },
            {
                where: {
                    id: claim_id
                }
            }
        )


        if(updatedRows === 0){
            return res.status(404).json({success: false, msg: 'Claim_ID not found'})
        }

        return res.status(200).json({success: true, data: updatedRows})
    }
    catch(err) {
        console.error(err)
        return res.status(500).json({success: false, msg: 'Cannot Update Claim'})
    }
    
}

const removeClaim = async (req, res) => {
    const { claim_id } = req.body
    try{
        const removedClaim = claims.destroy({
            where: {
                id: claim_id
            }
        })

        res.status(200).json({success: true, msg: 'Claim deleted'})
    }
    catch(err) {
        console.error(err)
        res.status(500).json({success: false, msg: 'Claim not found'})
    }
}


module.exports = {
    createClaim,
    getClaims,
    getAllClaims,
    updateClaimAdmin,
    updateClaimEmployee,
    removeClaim,
    getOneClaim
}