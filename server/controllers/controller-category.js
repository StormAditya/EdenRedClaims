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