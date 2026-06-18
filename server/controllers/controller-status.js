const status = require('../models/status')

const getStatus = async (req, res) => {
    try{
        const statuses = await status.findAll()

        return res.status(200).json({success: true, data: statuses})
    }
    catch(err){
        console.error(err)
        return res.status(500).json({success: false, msg: 'Server Error to get Status'})
    }
}

module.exports = { getStatus }