const user = require('../models/user')

const getUser = async (req, res) => {
    const users = await user.findAll()

    return res.status(200).json({success:true, data: users})
}

module.exports = {getUser,}