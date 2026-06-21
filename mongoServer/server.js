const express = require('express');
const cors = require('cors');
const {connection} = require('./db')
const Document = require("./models/documents")

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

connection();

app.post("/api/documents", async (req, res) => {
    try {
        const { receipt_id, document_file } = req.body;

        const newDoc = await Document.create({
            receipt_id: receipt_id,
            document_file: document_file
        })
        res.status(201).json({ success: true, data: newDoc });
    }
    catch (err) {
        console.error("MongoServer error saving document:", err);
        res.status(500).json({ success: false, msg: "Failed to save to MongoDB" })
    }
});

app.get('/api/documents/:receipt_id', async (req, res) => {
    try {
        const { receipt_id } = req.params;
        const document = await Document.findOne({ receipt_id: receipt_id });

        if (!document) {
            return res.status(404).json({ success: false, msg: "No image found" });
        }

        res.status(200).json({ success: true, data: document });
    } catch (err) {
        console.error("MongoServer Error fetching document:", err);
        res.status(500).json({ success: false, msg: "Server error fetching image" });
    }
});

app.delete('/api/documents/:receipt_id', async (req, res) => {
    try {
        const { receipt_id } = req.params;
        await Document.deleteOne({ receipt_id: receipt_id });
        
        res.status(200).json({ success: true, msg: "Image deleted from MongoDB successfully" });
    } catch (err) {
        console.error("MongoServer Error deleting document:", err);
        res.status(500).json({ success: false, msg: "Server error deleting image" });
    }
});


const port = process.env.PORT || 5001;

app.listen(port, () => {
    console.log(`Server listening on port: ${port}`)
}) 