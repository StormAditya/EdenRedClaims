const company = require('../models/company')

const addCompany = async (req, res) => {
    try{
        const { companyName } = req.body
        const newCompany = await company.create({
            company_name: companyName
        })

        return res.status(200).json({success: false, data: newCompany})
    }
    catch(err){
        console.error(err)
        return res.status(500).json({success: false, msg: "Server Error to add company..."})
    }
    
}

const getCompany = async (req, res) => {
    try{
        const companies = await company.findAll()

        return res.status(200).json({success: true, data: companies})

    }
    catch(err){
        console.error(err)
        return res.status(500).json({success: false, msg: "Server Error"})
    }
}

const removeCompany = async (req, res) => {
    try{
        const { company_id } = req.body

        const removedCompany = await company.destroy({
            id: company_id
        })
        res.status(200).json({success: true, msg: 'Deleted the company...'})
    }
    catch(err){
        console.error(err)
        return res.status(500).json({success: false, msg: "Server Error"})
    }
}

module.exports = {
    addCompany, getCompany, removeCompany
}
