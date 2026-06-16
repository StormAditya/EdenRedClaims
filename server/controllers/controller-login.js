const user = require('../models/user')

const createUser = async (req, res) => {
    try{
        const {id, name, password, user_type, balance, email_id, address, contact_number} = req.body

        
        if(user_type.toLowerCase() === 'admin'){
            const newUser = await user.create 
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
      return res.status(400).send('Invalid credentials');
    }

    console.log(`User logged in: ${user.name} (ID: ${user.id})`);
    res.send(`${user.name} is logged in as an : ${user.user_type}`);
    
  } catch (error) {
    res.status(500).send('Error while logging in!');
  }
}
