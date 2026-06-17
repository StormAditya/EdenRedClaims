const user = require('../models/user')
const claims = require('../models/claims')

const getUser = async (req, res) => {
    const users = await user.findAll()

    return res.status(200).json({success:true, data: users})
}

const updateUser = async (req, res) => {
    try {
        const { id, name, password, user_type, balance, email_id, address, contact_number } = req.body

        const [updatedRows] = await user.update(
            {
                name,
                password,
                user_type,
                address,
                contact_number,
                balance
            },
            { where: { id:id } }
        )

        if (updatedRows === 0) {
            return res.status(404).json({ success: false, msg: 'User not found with that email' })
        }

        return res.status(200).json({ success: true, msg: 'User updated successfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ success: false, msg: 'Error updating user', error: err.message })
    }
}

const removeUser = async (req, res) => {
    const {id} = req.params
    
    try{
        const remove = await user.destroy({
                where: {
                    id : id
                }
        })
        res.status(200).json({success:true, msg: "Deleted User"})
    }
    catch(err){
        console.error(err)
        res.status(500).json({success:false, msg:"User not found"})
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


module.exports = {getUser, removeUser, updateUser, getClaims}