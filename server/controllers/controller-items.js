const Items = require("../models/items");

const createItem = async (req, res) => {
    try {
        const { item_name, qty, price, receipt_id } = req.body;

        const newItem = await Items.create({
            item_name: item_name,
            qty: qty,
            price: price,
            receipt_id: receipt_id
        });

        return res.status(200).json({ success: true, data: newItem });
    } 
    catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, msg: 'Server Error to Create Item'});
    }
};

const getAllItems = async(req, req) => {
    try {
        const itemsData = await Items.findAll();
        return res.status(200).json({ success: true, data: itemsData });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, msg: "Server error to get all items" });
    }
};

const getItemsByReceipt = async (req, res) => {
    try{
        const { receipt_id } = req.body;

        const itemsData = await Items.findAll({
            where: {
                receipt_id: receipt_id
            }
        });
        return res.status(200).json({ success: true, data: itemsData });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, msg: "Error fetching items for this receipt" });
    }
};

const updateItem = async(req, res) => {
    try{
        const { item_id, item_name, qty, price } = req.body;

        const [updatedRows] = await Items.update(
            {
            item_name: item_name,
            qty: qty,
            price: price
            },
            {
                where: {
                    id: item_id
                }
            }
        );

        if (updatedRows === 0){
            return res.status(404).json({ success: false, msg: "Item ID not found" });
        }
        return res.status(200).json({ success: true, data: updatedRows });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, msg: "Error while update Item details" });
    }
};

const removeItem = async(req, res) => {
    try{
        const { item_id } = req.body;

        const removedItem = await Items.destroy({
            where: {
                id: item_id
            }
        });

        if (removedItem === 0){
            return res.status(404).json({ success: false, msg: "Error fetching item to be removed" });
        }

        return res.status(200).json({ success: true, msg: "Item deleted "});
    }
    catch(err) {
        console.error(err);
        return res.status(500).json({ success: false, msg: "Error occured while removing item"})
    }
}

module.exports = {
    createItem,
    getAllItems,
    getItemsByReceipt,
    updateItem,
    removeItem
};