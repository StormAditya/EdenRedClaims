const claims = require('../models/claims')
const createClaim = async (req, res) => {
    try{
        const { user_id, status_id, category_id, description, claim_amount} = req.body
        const newClaim = await claims.create({
            user_id: user_id,
            status_id: status_id,
            category_id: category_id,
            description: description,
            claim_amount: claim_amount,
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
        const claimsData = await claims.findAll()
        return res.status(200).json({success:true, data: claimsData})
    }catch(err){
        console.error(err)
        res.status(500).json({success:false, msg:"Error fetching claims"})
    }
    
}

const getClaims = async (req, res) => {
    const {user_id} = req.body
    try{
        const claimsData = await claims.findAll({
            where: {
                user_id: user_id
            }
        }) 
        return res.status(200).json({success:true, data: claimsData})
    }catch(err){
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

        const [updatedRows] = await claims.update(
            {
                status_id: status_id
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
    removeClaim
}