const User = require('../models/user')

const createUser = async (req, res) => {
    try{
        const {name, password, user_type, balance, email_id, address, contact_number} = req.body
        
        
        if(user_type === 'admin'){
          const newUser = await User.create({

                name: name,
                password: password,
                user_type: user_type,
                email_id: email_id
            })
            res.status(200).json({success:true, data: newUser})
        }
        else{
          const newUser = await User.create({

                name: name,
                password: password,
                user_type: user_type,
                email_id: email_id,
                address: address,
                contact_number: contact_number,
                balance: balance
                
            })
            res.status(200).json({success:true, data: newUser})
        }

        
    }
    catch(err){
        console.error(err)
        res.status(500).json({success: false, msg: 'Server Error to Create User'})
    }
}

const loginUser = async (req, res) => {
  try {
    const { email_id, password } = req.body;

    const user = await User.findOne({ 
      where: { 
        email_id: email_id, 
        password: password 
      } 
    });

    if (!user) {
      return res.status(400).json({success: false, msg: 'Invalid credentials'});
    }

    console.log(`User logged in: ${user.name} (ID: ${user.id})`);
    res.status(200).json({success: true, data: user});
    
  } catch (error) {
    console.error(error)
    res.status(500).json({success: false, msg: 'Error while logging in!'});
  }
}

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
            { where: { id: id } }
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

module.exports = {
  createUser,
  loginUser,
  getUser,
  updateUser,
  removeUser
}
