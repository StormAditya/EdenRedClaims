const category = require('../models/category')

const addCategory = async (req, res) => {
    try{
        const { categoryName } = req.body
        const newCategory = await category.create({
            category_name: categoryName
        })

        return res.status(200).json({success: false, data: newCategory})
    }
    catch(err){
        console.error(err)
        return res.status(500).json({success: false, msg: "Server Error to add category..."})
    }
    
}

const getCategory = async (req, res) => {
    try{
        const categories = await category.findAll()

        return res.status(200).json({success: true, data: categories})
    }
    catch(err){
        console.error(err)
        return res.status(500).json({success: false, msg: "Server Error"})
    }
}

const removeCategory = async (req, res) => {
    try{
        const { categoryID } = req.body

        const removedCategory = await category.destroy({
            id: categoryID
        })
        res.status(200).json({success: true, msg: 'Deleted the category...'})
    }
    catch(err){
        console.error(err)
        return res.status(500).json({success: false, msg: "Server Error"})
    }
}

module.exports = {
    addCategory, getCategory, removeCategory
}