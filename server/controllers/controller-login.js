const createUser = async (req, res) => {
    try{
        const {id, name, password, user_type, balance, email_id, address, contact_number} = req.body

    }
    catch(err){
        console.error(err)
        res.status(500).json({success: false, msg: 'Server Error to Create User'})
    }
}