const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Import uuid for generating unique IDs

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
            _id: String, // String to store slide IDs
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

// Fetch a specific collection by ID from the database
app.get('/collections/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const collection = await Collection.findById(id); // Fetch collection by ID from MongoDB

        if (collection) {
            res.json(collection); // Return the specific collection if found
        } else {
            res.status(404).json({ message: 'Collection not found' }); // Return a 404 if not found
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching collection', error });
    }
});

// Update an existing collection and its slides in the database
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

app.put('/api/collections/:collectionId/slides/:slideId', async (req, res) => {
    const { collectionId, slideId } = req.params;
    const { title, content } = req.body;

    try {
        // Find the collection
        const collection = await Collection.findById(collectionId);
        if (!collection) {
            return res.status(404).json({ message: 'Collection not found' });
        }

        // Find the slide to update
        const slide = collection.slides.id(slideId);
        if (!slide) {
            return res.status(404).json({ message: 'Slide not found' });
        }

        // Update the slide's title and content
        slide.title = title;
        slide.content = content;

        // Save the collection with the updated slide
        await collection.save();

        res.status(200).json(collection);
    } catch (error) {
        console.error('Error updating slide:', error);
        res.status(500).json({ message: 'Error updating slide', error });
    }
});

// New Route: Create a new slide within a collection
app.post('/api/collections/:collectionId/slides', async (req, res) => {
    const { collectionId } = req.params;
    const { title, content } = req.body;

    try {
        const collection = await Collection.findById(collectionId);
        if (!collection) {
            return res.status(404).json({ message: 'Collection not found' });
        }

        const newSlide = {
            _id: uuidv4(), // Generate a unique ID using uuid
            title,
            content,
        };

        collection.slides.push(newSlide);
        await collection.save();

        res.status(201).json(collection);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating slide', error });
    }
});

// Delete a specific slide from a collection (this needs to come before the collection delete route)
app.delete(
    '/api/collections/:collectionId/slides/:slideId',
    async (req, res) => {
        const { collectionId, slideId } = req.params;

        try {
            // Find the collection by ID
            const collection = await Collection.findById(collectionId);
            if (!collection) {
                return res
                    .status(404)
                    .json({ message: 'Collection not found' });
            }

            // Filter out the slide from the collection
            collection.slides = collection.slides.filter(
                (slide) => slide._id.toString() !== slideId
            );

            // Save the updated collection
            await collection.save();

            // Send back the updated collection
            res.status(200).json(collection);
        } catch (error) {
            console.error('Error deleting slide:', error);
            res.status(500).json({ message: 'Error deleting slide', error });
        }
    }
);

// Delete an entire collection
app.delete('/api/collections/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const collection = await Collection.findByIdAndDelete(id);
        if (!collection) {
            return res.status(404).json({ message: 'Collection not found' });
        }
        res.status(200).json({ message: 'Collection deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting collection', error });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
