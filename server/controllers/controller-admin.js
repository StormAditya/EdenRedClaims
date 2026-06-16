const user = require('../models/user')

const getUser = async (req, res) => {
    const users = await user.findAll()

    return res.status(200).json({success:true, data: users})
}

const removeUser = async (req, res) => {
    const {id} = req.params
    const remove = await user.destroy({
        where: {
            id : id
        }
    })
}

module.exports = {getUser, removeUser}