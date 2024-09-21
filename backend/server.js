const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port = 5001;

app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/collectionsDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Create a schema for Collections
const collectionSchema = new mongoose.Schema({
    title: String,
    description: String,
    slides: [
        {
            _id: String,
            title: String,
            content: String,
        },
    ],
});

// Create a model for Collections
const Collection = mongoose.model('Collection', collectionSchema);

// Fetch all collections from the database
app.get('/collections', async (req, res) => {
    try {
        const collections = await Collection.find(); // Fetch from MongoDB
        res.json(collections);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching collections', error });
    }
});

// Create a new collection in the database
app.post('/collections', async (req, res) => {
    try {
        const collectionData = req.body;
        const newCollection = new Collection(collectionData); // Create a new collection with MongoDB model
        await newCollection.save(); // Save to MongoDB
        res.json(newCollection);
    } catch (error) {
        res.status(500).json({ message: 'Error creating collection', error });
    }
});

// Update an existing collection and its slides in the database
const { v4: uuidv4 } = require('uuid'); // Import uuid for generating unique IDs

app.put('/collections/:id', async (req, res) => {
    const { id } = req.params;
    let updatedCollection = req.body;

    // Ensure the slides array is defined and is an array, even if it's empty
    updatedCollection.slides = Array.isArray(updatedCollection.slides)
        ? updatedCollection.slides
        : [];

    // Ensure every slide has a unique _id before updating the collection in MongoDB
    updatedCollection.slides = updatedCollection.slides.map((slide) => {
        if (!slide._id) {
            slide._id = uuidv4(); // Assign a unique ID if it doesn't exist
        }
        return slide;
    });

    try {
        // Update the collection with new slides or changes to slides
        const collection = await Collection.findByIdAndUpdate(
            id,
            updatedCollection,
            {
                new: true, // Return the updated document
            }
        );
        res.json(collection);
    } catch (error) {
        res.status(500).json({ message: 'Error updating collection', error });
    }
});

// Delete a collection by ID from the database
app.delete('/collections/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await Collection.findByIdAndDelete(id); // Remove the collection from MongoDB
        res.json({ message: 'Collection deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting collection', error });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
