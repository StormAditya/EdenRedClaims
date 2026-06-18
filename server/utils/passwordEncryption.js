const bcrypt = require('bcryptjs')

const encrypt = async (password) => {
    const salt = await bcrypt.genSalt(12);
    const hashed = await bcrypt.hash(password, salt);
    return hashed;
}

const validate = async (enteredPassword, DB_Password) => {
    const check = await bcrypt.compare(enteredPassword, DB_Password);
    return check;
}

module.exports = {encrypt, validate}