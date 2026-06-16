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

module.exports = {
  createUser,
  loginUser,
}
